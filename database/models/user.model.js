import mongoose from "mongoose";
import bcrypt from 'bcrypt'


const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'user name required'],
        minLength: [1, 'too short user name']
    },
    email: {
        type: String,
        trim: true,
        required: [true, ' email required'],
        minLength: 1,
        unique: [true, 'email must be requires'],
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'minLength 6 characters'],
    },
    profilePic: String,
    passwordChangedAt: Date,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }],
    addresses: [{
        city: String,
        street: String,
        phone: String,
    }]
})

userSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, 8)
    console.log(this);
})

userSchema.pre('findOneAndUpdate', function () {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 8)

    console.log(this);
})

export const userModel = mongoose.model("user", userSchema)