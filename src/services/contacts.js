import { Contact } from "../models/contact.js";

export function getAllContacts() {

    const contacts = Contact.find();
    return contacts

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
