const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');
const {mongo} = require("mongoose");

const OfferSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a offer name'],
        maxlength: [50, 'Offer name can not be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please insert offer description'],
        maxlength: [500, 'Offer description can not be more than 500 characters']
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be more than 20 characters']
    },
    address: {
        type: String,
        required: [true, 'Please insert an address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    category: {
        type: [String],
        required: true,
        enum: [
            'Electronics',
            'Health',
            'Fashion',
            'Beauty',
            'Garden',
            'Gaming'
        ]
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    negotiate: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

OfferSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
})

OfferSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }
    this.address = undefined;
    next();
})

module.exports = mongoose.model('Offer', OfferSchema);