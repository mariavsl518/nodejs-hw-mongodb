import {
    createContact,
    getAllContacts,
    getContactById,
    deleteContact,
    updateContact
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { contactSchema } from '../validation/student.js';
import { parsePaginationQuery } from '../utils/parsePaginationQuery.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export async function getContactsController(req, res) {
    const { page, perPage } = parsePaginationQuery(req.query)
    const { sortBy, sortOrder } = parseSortParams(req.query)
    const filter = parseFilterParams(req.query)

    const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, filter, userId:req.user._id })

    res.send({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts
    })
}

export async function getContactController(req, res, next) {
    console.log(req.user)

    const { contactId } = req.params;
    const contact = await getContactById(contactId)

    if (contact === null) {
        return next(createHttpError.NotFound("Contact not found"))
    }
    if (contact.userId.toString() !== req.user._id.toString()) {
        return next(createHttpError(404, 'Not found'))
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
        userId: req.user._id,
    }
    const result = contactSchema.validate(contact, { abortEarly: false })
    const newContact = await createContact(result.value)

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
        userId: req.user._id,
    }
    const updatedContact = await updateContact(contactId, contact)
    if (updatedContact.userId.toString() !== req.user._id.toString()) {
        return next(createHttpError(404, 'Action is not allowed'))
    }

    res.status(200).send({
        status: 200,
        message: "Successfully patched a contact!",
        data: updatedContact
    })

}

export async function deleteContactController(req, res, next) {
    const { contactId } = req.params;
    const result = await deleteContact(contactId)

    if (result === null) {
        return next(createHttpError.NotFound('Contact not found'))
    }
    if (result.userId.toString() !== req.user._id.toString()) {
        return next(createHttpError(404, 'Action is not allowed'))
    }
    res.status(204).end();
}

//branch check
