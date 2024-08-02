import { Contact } from "../models/contact.js";

export function getAllContacts() {

    return Contact.find()

}
