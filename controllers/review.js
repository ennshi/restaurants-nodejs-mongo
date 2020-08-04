const Review = require('../models/review');
const Restaurant = require('../models/restaurant');
const User = require('../models/user');

exports.getReviews = (req, res, next) => {
    Review.find()
        .then(reviews => {
            res.status(200).json(reviews);
        })
        .catch((err) => console.log(err));
};

exports.createReview = (req, res, next) => {
    // if(!req.errors.isEmpty) {
    //     return res.status(422).json({errors: req.errors.errors});
    // }
    const {text, rating, restaurant} = req.body;
    const creator = '5f2959703154ab111c2d405b';
    const review = new Review({
        text,
        rating,
        restaurant,
        creator
    });
    review.save()
        .then(() => {
            return Restaurant.findById(restaurant);
        })
        .then(restaurant => {
            restaurant.reviews.push(review);
            return restaurant.save();
        })
        .then(() => {
            return User.findById(creator);
        })
        .then(user => {
            user.reviews.push(review);
            return user.save();
        })
        .then(() => {
            res.status(201).json(review);
        })
        .catch((err) => console.log(err));
};

exports.updateReview = (req, res, next) => {
    // if(!req.errors.isEmpty) {
    //     return res.status(422).json({errors: req.errors.errors});
    // }
    const reviewId = req.params.reviewId;
    const {text, rating} = req.body;
    Review.findById(reviewId)
        .then(review => {
            if(!review) {
                return res.status(404).json({message: "No review found"});
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
        .catch((err) => console.log(err));
};

exports.deleteReview = (req, res, next) => {
    const reviewId = req.params.reviewId;
    const userId = '5f2959703154ab111c2d405b';
    let restaurantId;
    Review.findById(reviewId)
        .then(review => {
            if(!review) {
                return res.status(404).json({message: "No review found"});
                // const error = new Error('No review found');
                // error.statusCode = 404;
                // throw error;
            }
            restaurantId = review.restaurant;
            return Review.findByIdAndRemove(reviewId);
        })
        .then(() => {
            return User.findById(userId);
        })
        .then(user => {
            user.reviews.pull(reviewId);
            return user.save();
        })
        .then(() => {
            return Restaurant.findById(restaurantId);
        })
        .then(restaurant => {
            restaurant.reviews.pull(reviewId);
            return restaurant.save();
        })
        .then(() => {
            res.status(200).json({reviewId});
        })
        .catch((err) => console.log(err));
};
