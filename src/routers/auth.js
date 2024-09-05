import express from 'express'
import { ctrlWrapper } from '../utils/ctrlWrapper.js'
import {validateBody} from '../middlewares/validateBody.js';
import {
    registerSchema,
    loginSchema,
    sendResetEmailSchema,
    resetPwdSchema
} from '../validation/auth.js';
import {
    registerController,
    loginController,
    refreshController,
    logoutController,
    sendResetEmailController,
    resetPwdController
} from '../controllers/auth.js';

const router = express.Router();
const parser = express.json()

router.post('/register', parser, validateBody(registerSchema), ctrlWrapper(registerController))
router.post('/login', parser, validateBody(loginSchema), ctrlWrapper(loginController))
router.post('/refresh', ctrlWrapper(refreshController))
router.post('/logout', ctrlWrapper(logoutController))
router.post('/send-reset-email', parser, validateBody(sendResetEmailSchema), ctrlWrapper(sendResetEmailController))
router.post('/reset-pwd', parser, validateBody(resetPwdSchema), ctrlWrapper(resetPwdController))

export default router
