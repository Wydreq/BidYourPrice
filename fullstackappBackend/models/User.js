const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please insert first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please insert last name']
    },
    email: {
        type: String,
        required: [true, 'Please insert email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please insert password'],
        minLength: 6,
        select: false
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please insert date of birth'],
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    role: {
        type: String,
        enum: ['user'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

module.exports = mongoose.model('User', UserSchema);