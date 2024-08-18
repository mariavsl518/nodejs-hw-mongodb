import { Contact } from "../models/contact.js";

export async function getAllContacts({ page, perPage, sortBy, sortOrder }) {

    const skip = page > 0 ? (page - 1) * perPage : 0;

    const [data, count] = await Promise.all([
        Contact.find().sort({[sortBy]: sortOrder}).skip(skip).limit(perPage),
        Contact.countDocuments(),
    ])

    const totalPages = Math.ceil(count / perPage);

    return {
        data,
        page,
        perPage,
        totalItems: count,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: totalPages - page > 0,
    }

}

export function getContactById(contactId) {
    const contact = Contact.findById(contactId);
    return contact
}

export function createContact(payload) {
    const contact = Contact.create(payload)
    return contact
}

export function deleteContact(contactId) {
    return Contact.findByIdAndDelete(contactId)
}

export function updateContact(contactId, payload) {
    return Contact.findByIdAndUpdate(contactId, payload, {new:true})
}
