const Review = require('../models/review');

exports.getReviews = (req, res, next) => {
    Review.find()
        .then(reviews => {
            res.status(200).json(reviews);
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createReview = (req, res, next) => {
    if(!req.errors.isEmpty) {
        const error = new Error('Validation failed');
        error.errors = req.errors.errors;
        error.statusCode = 422;
        throw error;
    }
    const {text, rating, restaurant} = req.body;
    const creator = req.userId;
    const review = new Review({
        text,
        rating,
        restaurant,
        creator
    });
    review.save()
        .then(() => {
            res.status(201).json(review);
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateReview = (req, res, next) => {
    if(!req.errors.isEmpty) {
        const error = new Error('Validation failed');
        error.errors = req.errors.errors;
        error.statusCode = 422;
        throw error;
    }
    const reviewId = req.params.reviewId;
    const {text, rating} = req.body;
    Review.findById(reviewId)
        .then(review => {
            if(!review) {
                const error = new Error('Review not found');
                error.statusCode(404);
                throw error;
            }
            if(review.creator.toString() !== req.userId) {
                const error = new Error('Authorization failed');
                error.statusCode(401);
                throw error;
            }
            Object.assign(review, {
                text: text.trim(),
                rating
            });
            return review.save();
        })
        .then(review => {
            res.status(200).json(review);
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteReview = (req, res, next) => {
    const reviewId = req.params.reviewId;
    Review.findById(reviewId)
        .then(review => {
            if(!review) {
                const error = new Error('Review not found');
                error.statusCode(404);
                throw error;
            }
            if(review.creator.toString() !== req.userId) {
                const error = new Error('Authorization failed');
                error.statusCode(401);
                throw error;
            }
            return review.remove(reviewId);
        })
        .then(() => {
            res.status(200).json({reviewId});
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
