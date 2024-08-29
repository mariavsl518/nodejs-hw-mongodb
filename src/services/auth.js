import createHttpError from 'http-errors'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import { User } from '../models/user.js'
import { Session } from '../models/session.js'
import { ACCESS_TOKEN_TTL , REFRESH_TOKEN_TTL } from '../constants/constants.js'

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

    const accessToken = crypto.randomBytes(30).toString('base64')
    const refreshToken = crypto.randomBytes(30).toString('base64')

    return Session.create({
        userId: maybeUser._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
        refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
}

