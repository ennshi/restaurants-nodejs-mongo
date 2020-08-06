const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./review');

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
    location: {
        country: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        }
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

restaurantSchema.pre('remove', function (next) {
    const restaurant = this;
    Review.deleteMany({ restaurant: restaurant._id })
        .then(() => {
            next();
        })
});
module.exports = mongoose.model('Restaurant', restaurantSchema);
