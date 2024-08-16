import Joi from "joi";

const contactSchema = Joi.object({

    name: Joi.string().min(3).max(20).required().messages(),
    phoneNumber: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(3).max(20).optional(true),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().min(3).max(20).required(),

})

export {contactSchema}
