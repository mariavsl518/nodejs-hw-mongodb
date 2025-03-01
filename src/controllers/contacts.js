import {
    createContact,
    getAllContacts,
    getContactById,
    deleteContact,
    updateContact
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { notFoundHandler } from '../middlewares/notFoundHandler.js';

export async function getContactsController (req, res) {

                const contacts = await getAllContacts()

                res.send({
                    status: 200,
                    message: 'Successfully found contacts!',
                    data: contacts
                })
}

export async function getContactController(req, res, next) {

                const { contactId } = req.params;

                const contact = await getContactById(contactId)

            if (contact === null) {
                    return next(createHttpError.NotFound("Contact not found"))
                }

                res.send({
                    status: 200,
                    message: `Successfully found contact with id ${contactId}!`,
                    data: contact
                })
}

export async function createContactController (req, res, next) {
    const contact = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isFavourite: req.body.isFavourite,
        contactType: req.body.contactType,
    }

    const newContact = await createContact(contact)

    res.status(201).send({status: 201, message:"Successfully created a contact!", data: newContact})
}

export async function updateContactController(req, res, next) {
    const { contactId } = req.params;

    const contact = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isFavourite: req.body.isFavourite,
        contactType: req.body.contactType,
    }

    const updatedContact = await updateContact(contactId, contact)

    console.log(updatedContact);

    res.status(200).send({	status: 200, message: "Successfully patched a contact!", data:updatedContact})

}

export async function deleteContactController(req, res, next) {
    const { contactId } = req.params;

    const result = await deleteContact(contactId)

    if (result === null) {
        return next(createHttpError.NotFound('Contact not found'))
    }

    res.status(204).end();
}

