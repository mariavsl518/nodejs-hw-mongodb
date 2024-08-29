import mongoose, { model } from "mongoose";

const sessionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    accessToken: {
        type: String,
        require: true
    },
    refreshToken: {
        type: String,
        require: true
    },
    accessTokenValidUntil: {
        type: Date,
        require: true
    },
    refreshTokenValidUntil: {
        type: Date,
        require: true
    }
}, {
        timestamps: true,
        versionKey: false,
})

export const Session = mongoose.model('Session', sessionSchema)
