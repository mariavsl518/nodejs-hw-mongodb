import { registerUser, loginUser } from "../services/auth.js"

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
        status: res.status,
        message: 'Successfully logged in a user!',
        data: {
            accessToken: session.accessToken
        }
    })
}
