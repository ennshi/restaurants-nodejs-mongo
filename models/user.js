const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./review');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    photoUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'active'
    }
}, { timestamps: true });

userSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'creator'
});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
};

userSchema.pre('remove', function (next) {
    const user = this;
    Review.deleteMany({ creator: user._id })
        .then(() => {
            next();
        })
});

module.exports = mongoose.model('User', userSchema);
