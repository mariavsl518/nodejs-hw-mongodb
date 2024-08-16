import express from 'express';
import {
    getContactsController,
    getContactController,
    createContactController,
    deleteContactController,
    updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema } from '../validation/student.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = express.Router();
const parser = express.json()

    router.get('/', ctrlWrapper(getContactsController))

    router.get('/:contactId', isValidId, ctrlWrapper(getContactController))

    router.post('/', parser, validateBody(contactSchema), ctrlWrapper(createContactController))

    router.patch('/:contactId', isValidId, parser, validateBody(contactSchema), ctrlWrapper(updateContactController))

    router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController))

export default router;
