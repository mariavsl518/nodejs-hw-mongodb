import fs from 'node:fs/promises'
import path from 'node:path'
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
import { uploadCloudinary } from '../utils/uploadToCloudinary.js';
import { Contact } from '../models/contact.js';

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

    const { contactId } = req.params;
    const contact = await getContactById({ _id: contactId, userId: req.user._id })

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

export async function createContactController(req, res) {
    let photo = null

    if (typeof req.file !== 'undefined') {

        if (process.env.ENABLE_CLOUDINARY === 'true') {
            const result = await uploadCloudinary(req.file.path)
            await fs.unlink(req.file.path);
            photo = result.secure_url
        }
        else {
            await fs.rename(req.file.path,
            path.resolve('src', 'contacts/avatars',
            req.file.filename)
            )
            photo = `http://localhost:8080/avatars/${req.file.filename}`
        }
    }
    const contact = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isFavourite: req.body.isFavourite,
        contactType: req.body.contactType,
        userId: req.user._id,
        photo,
    }
    const result = contactSchema.validate(contact, { abortEarly: false })
    const newContact = await createContact(result.value)

    res.status(201).send({status: 201, message:"Successfully created a contact!", data: newContact})
}

export async function updateContactController(req, res, next) {
    const { contactId } = req.params;
    const userId = req.user._id.toString()

    let photo = await Contact.findById(contactId).photo

    if (req.file !== undefined) {

        if (process.env.ENABLE_CLOUDINARY === 'true') {
            const result = await uploadCloudinary(req.file.path)
            await fs.unlink(req.file.path);
            photo = result.secure_url
        }
        else {
            await fs.rename(req.file.path,
            path.resolve('src', 'contacts/avatars',
            req.file.filename)
            )
            photo = `http://localhost:8080/avatars/${req.file.filename}`
        }
    }
    const contact = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isFavourite: req.body.isFavourite,
        contactType: req.body.contactType,
        photo,
    }
    const updatedContact = await updateContact({ _id:contactId, userId}, contact)

    if (updatedContact.userId.toString() !== userId) {
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
    const userId = req.user._id.toString();

    const result = await deleteContact({ _id:contactId, userId})

    if (result === null) {
        return next(createHttpError.NotFound('Contact not found'))
    }
    if (result.userId.toString() !== userId) {
        return next(createHttpError(404, 'Action is not allowed'))
    }
    res.status(204).end();
}
