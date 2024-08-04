import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            optional: true,
        },
        isFavourite: {
            type: Boolean,
            default: false,
        },
        contactType: {
            type: String,
            enum: ['work', 'home', 'personal'],
            required: true,
            default: true,
        },
    },
    {
        timestamps: true
    }
)

export const Contact = mongoose.model('contacts', contactSchema);
