const {MODIFICATION_PERIOD} = require('../constants/time');
const Review = require('../models/review');
const {sortParse, filterParse, createError} = require('./helpers');

exports.getReviews = (req, res, next) => {
    const curPage = +req.query.page || 1;
    const perPage = +req.query.limits || 8;
    let filter = {};
    let sort = {createdAt: -1};
    if(req.query.filter) {
        filter = filterParse(req.query.filter);
    }
    if(req.query.sort) {
        sort = sortParse(req.query.sort);
    }
    let totalNumber;
    Review.find({...filter})
        .countDocuments()
        .then(count => {
            totalNumber = count;
            return Review.find({...filter}, {}, {
                limit: perPage,
                skip: ((curPage - 1) * perPage),
                sort
            })
                .populate('creator')
                .populate('restaurant');
        })
            .then(reviews => {
                res.status(200).json({reviews, totalNumber});
            })
            .catch((err) => {
                next(err);
            });
};

exports.createReview = (req, res, next) => {
    if(!req.errors.isEmpty) {
        throw createError(422, 'Validation failed', req.errors.errors);
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
            Review.findById(review._id)
                .populate('creator')
                .then(fetchedReview => {
                    res.status(201).json(fetchedReview);
                })
        })
        .catch((err) => {
            next(err);
        });
};

exports.updateReview = (req, res, next) => {
    if(!req.errors.isEmpty) {
        throw createError(422, 'Validation failed', req.errors.errors);
    }
    const reviewId = req.params.reviewId;
    const {text, rating} = req.body;
    Review.findById(reviewId)
        .then(review => {
            if(!review) {
                throw createError(404, 'Review not found');
            }
            if(review.creator.toString() !== req.userId) {
                throw createError(401, 'Authorization failed');
            }
            if(Date.now() - (new Date(review.createdAt)) >= MODIFICATION_PERIOD) {
                throw createError(403, 'Modification period has expired');
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
            next(err);
        });
};

exports.deleteReview = (req, res, next) => {
    const reviewId = req.params.reviewId;
    Review.findById(reviewId)
        .then(review => {
            if(!review) {
                throw createError(404, 'Review not found');
            }
            if(review.creator.toString() !== req.userId) {
                throw createError(401, 'Authorization failed');
            }
            return review.remove(reviewId);
        })
        .then(() => {
            res.status(200).json({reviewId});
        })
        .catch((err) => {
            next(err);
        });
};
