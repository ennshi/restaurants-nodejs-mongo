const {isLength, isValidRating} = require('./helpers');

const isValidReview = (req, res, next) => {
    const errors = {};
    const {text, rating} = req.body;
    if(!isLength(text.trim(), {min: 10, max: 300})){
        errors.text = "Please provide a description 10-300 characters long";
    }
    if(!isValidRating({number: rating, min: 1, max: 5})) {
        errors.rating = "Rating must be between 1 and 5";
    }
    const isEmpty = !Object.keys(errors).length;
    req.errors = {errors, isEmpty};
    next();
};

module.exports = isValidReview;
