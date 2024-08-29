import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
},
    {
        timestamps: true,
        versionKey: false,
    }
)

userSchema.methods.toJSON = function() {
    const obj = this.toObject()
    delete obj.password
    return obj
}

export const User = mongoose.model('User', userSchema)
