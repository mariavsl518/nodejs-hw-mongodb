import express from 'express';
import {
    getContactsController,
    getContactController,
    createContactController,
    deleteContactController,
    updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();
const parser = express.json()

    router.get('/', ctrlWrapper(getContactsController))

    router.get('/:contactId', ctrlWrapper(getContactController))

    router.post('/', parser, ctrlWrapper(createContactController))

    router.patch('/:contactId', parser, ctrlWrapper(updateContactController))

    router.delete('/:contactId', ctrlWrapper(deleteContactController))

export default router;
