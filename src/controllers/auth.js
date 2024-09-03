import { registerUser, loginUser, logoutUser, refreshUserSession } from "../services/auth.js"

export async function registerController(req, res) {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    const registeredUser = await registerUser(user)

    res.send({status:200, message: "Successfully registered a user", data: registeredUser})
}

export async function loginController(req, res) {
    const { email, password } = req.body
    const session = await loginUser(email, password);

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    })

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    })

    res.send({
        status: 200,
        message: 'Successfully logged in a user!',
        data: {
            accessToken: session.accessToken
        }
    })
}

export async function refreshController(req, res) {
    const { sessionId, refreshToken } = req.cookies

    const session = await refreshUserSession(sessionId, refreshToken)

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    })

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    })

    res.send({
            status: res.status,
            message: "Successfully refreshed a session!",
            data: accessToken,
        })
}

export async function logoutController(req, res) {
    const { sessionId } = req.cookies
        if (typeof sessionId === 'string') {
            await logoutUser(sessionId)
        }
        res.clearCookie('refreshToken')
        res.clearCookie('sessionId')

        res.status(204).end()
    }
