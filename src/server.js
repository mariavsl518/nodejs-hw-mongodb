import express from "express";
import pinoHTTP from "pino-http";
import cors from 'cors'
import contactsRoutes from "./routers/contacts.js";
import { errorHandler } from './middlewares/errorHandler.js'
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

export const setupServer = () => {

    const PORT = process.env.PORT
    const app = express()

    app.use(pinoHTTP())

        app.use(
        cors({
            origin: `http://localhost:${PORT}`,
            optionsSuccessStatus: 200,
        }),
        );
    
    app.use('/contacts', contactsRoutes)

    app.use(errorHandler)
    app.use(notFoundHandler)

    app.listen(PORT, () =>{
           console.log(`Server is runnimg on port ${PORT}`)

        })


}
