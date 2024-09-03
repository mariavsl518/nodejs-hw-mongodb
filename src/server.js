// import pinoHTTP from "pino-http";
import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'
import contactsRoutes from "./routers/contacts.js";
import authRoutes from './routers/auth.js'
import { authenticate } from "./middlewares/authenticate.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const setupServer = () => {

    const PORT = process.env.PORT
    const app = express()

    app.use(cookieParser())

    // app.use(pinoHTTP())

    app.use(
        cors({
            origin: `http://localhost:${PORT}`,
            optionsSuccessStatus: 200,
        }),
        );

    app.use('/contacts', authenticate, errorHandler, contactsRoutes)
    app.use('/auth', authRoutes)

    app.use(notFoundHandler)
    app.use('*', errorHandler)

    app.listen(PORT, () =>{
           console.log(`Server is runnimg on port ${PORT}`)

        })

}
