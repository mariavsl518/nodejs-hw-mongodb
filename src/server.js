import express from "express";
import cors from 'cors'
import pinoHTTP from "pino-http";
import { getAllContacts, getContactById } from "./services/contacts.js";

export const setupServer = () => {

    const PORT = process.env.PORT
    const app = express()

    app.use(pinoHTTP())

    try {

        app.use(
        cors({
            origin: `http://localhost:${PORT}`,
            optionsSuccessStatus: 200,
        }),
        );


        app.get('/contacts', async (req, res) => {
            try {

                const contacts = await getAllContacts()

                res.send({
                    status: 200,
                    message: 'Successfully found contacts!',
                    data: contacts
                })

            } catch (error) {
                console.error(error);

                res.status(500).send({ message: 'Internal Server Error' });
            }
        })

        app.get('/contacts/:contactId', async (req, res) => {
            try {

                const { contactId } = req.params;

                const contact = await getContactById(contactId)

                if (contact === null) {
                    return res
                        .status(404)
                        .send({
                            status: 404, message: 'Contact not found' })
                }

                res.send({
                    status: 200,
                    message: `Successfully found contact with id ${contactId}!`,
                    data: contact
                })


            } catch (error) {
                console.error(error);

                res.status(500).send({ message: 'Internal Server Error' });
            }
        })

        app.use('*', (req, res, next) => {
            res.status(404).send({
                message: 'Not found',
            })
        })

        app.listen(PORT, () =>{
           console.log(`Server is runnimg on port ${PORT}`);

        })

    } catch (error) {
        console.error(error)
    }

}
