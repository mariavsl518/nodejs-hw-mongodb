import createHttpError from 'http-errors'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'
import { Session } from '../models/session.js'
import { ACCESS_TOKEN_TTL , REFRESH_TOKEN_TTL } from '../constants/constants.js'
import { sendMail } from '../utils/sendMail.js'
import { SMTP } from '../constants/constants.js'

export async function registerUser(user) {
    const maybeUser = await User.findOne({ email: user.email })
    if (maybeUser !== null) {
        throw createHttpError(409, 'Email in use')
    }
    user.password = await bcrypt.hash(user.password, 10)
    return User.create(user)
}

export async function loginUser(email, password) {
    const maybeUser = await User.findOne({ email })
    if (maybeUser === null) {
        throw createHttpError(404, 'User not found')
    }
    const compare = await bcrypt.compare(password, maybeUser.password)
    if (compare === false) {
        throw createHttpError(401, 'Unauthorized')
    }
    await Session.deleteOne({ userId: maybeUser._id });

    return Session.create({
        userId: maybeUser._id,
        accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
        refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
}

export async function refreshUserSession (sessionId, refreshToken) {
    const session = await Session.findOne({ _id: sessionId, refreshToken })

    if (session === null) {
        throw createHttpError(401, 'Session not found')
    }
    if (new Date() > new Date(session.refreshTokenValidUntil)) {
        throw createHttpError(401, 'Refresh token has expired')
    }
    await Session.deleteOne({ _id: sessionId })

    return Session.create({
        userId: session.userId,
        accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
        refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
}

export async function logoutUser(sessionId) {
    return Session.deleteOne({_id:sessionId})
}

export async function sendResetEmail(email) {
    const user = await User.findOne({email})
    if (user === null) {
        throw createHttpError(404, 'User not found')
    }
    console.log(user);
    const token = jwt.sign(
    {
        sub: user._id,
        name: user.email
    },
        process.env.JWT_SECRET,
        { expiresIn: '5m' })

    try {
        await sendMail({
        from: SMTP.FROM_EMAIL,
        to: email,
        subject: "Reset your password",
        html: `<p>Please <a href="https://${process.env.APP_DOMAIN}/reset-password?token=${token}">click</a> to reset your password</p>`
    })
    } catch (error) {
        throw createHttpError(500, "Failed to send the email, please try again later.")
    }
}

export async function resetPwd(password, token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded.sub, email: decoded.name })

        if (user === null) {
            throw createHttpError(404, "User not found!")
        }
        const newPassword = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate({_id: user._id}, { password: newPassword })

    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            throw createHttpError(401, "Token is expired or invalid")
        }
        throw error
    }
}
