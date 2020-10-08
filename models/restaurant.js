const mongoose = require('mongoose');
const countrycodelookup = require('country-code-lookup');
const Schema = mongoose.Schema;

const Review = require('./review');
const geocoder = require('../utils/geocoder');

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
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
        country: String
    },
    photoUrl: {
        type: String
    }
}, { timestamps: true });

restaurantSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'restaurant'
});

restaurantSchema.pre('save', function (next) {
    geocoder.geocode(this.address)
        .then(loc => {
            let address = loc[0].formattedAddress.split(',');
            address = `${address.slice(0, (address.length - 1)).join(',')}, ${countrycodelookup.byIso(loc[0].countryCode).country}`;
            this.location = {
                type: 'Point',
                coordinates: [loc[0].longitude, loc[0].latitude],
                formattedAddress: address,
            };
            this.address = undefined;
            next();
        });
});

restaurantSchema.pre('remove', function (next) {
    const restaurant = this;
    Review.deleteMany({ restaurant: restaurant._id })
        .then(() => {
            next();
        })
});
module.exports = mongoose.model('Restaurant', restaurantSchema);
