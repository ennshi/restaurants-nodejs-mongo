const path = require('path');
const fs = require('fs');

const Restaurant = require('../models/restaurant');
const {sortParse} = require('./helpers');
const DEFAULT_PHOTO = '/public/img/restaurants/default.png';

exports.getRestaurants = (req, res, next) => {
    const curPage = +req.query.page || 1;
    const perPage = +req.query.limits || 10;
    let filter = {};
    let sort = {name: 1};
    if(req.query.filter) {
        filter = filterParse(req.query.filter);
    }
    if(req.query.sort) {
        sort = sortParse(req.query.sort);
    }
    let totalNumber;
    Restaurant.find({...filter})
        .countDocuments()
        .then(count => {
            totalNumber = count;
            return Restaurant
                .aggregate(pipelineGetRestaurants({filter, sort, curPage, perPage}));
        })
        .then((restaurants) => {
            res.status(200).json(restaurants);
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getRestaurant = (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    Restaurant.findById(restaurantId)
        .then(restaurant => {
            if (!restaurant) {
                const error = new Error('Restaurant not found');
                error.statusCode = 404;
                throw error;
            }
            return restaurant.populate({
                path: 'reviews'
            })
                .execPopulate();
        })
        .then(restaurant => {
            res.status(200).json({
                restaurant,
                reviews: restaurant.reviews,
                reviewsStat: resultReviews(restaurant.reviews)
            });
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createRestaurant = (req, res, next) => {
    if(!req.errors.isEmpty) {
        const error = new Error('Validation failed');
        error.errors = req.errors.errors;
        error.statusCode = 422;
        throw error;
    }
    const {name, description, country, state, city, address} = req.body;
    const photoUrl = req.file ? req.file.path.replace( /\\/g, '/') : DEFAULT_PHOTO;
        const restaurant = new Restaurant({
        name,
        description,
        photoUrl,
        location: {
            country,
            state,
            city,
            address
        }
    });
    restaurant.save()
        .then(restaurant => {
            res.status(201).json(restaurant);
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateRestaurant = (req, res, next) => {
    if(!req.errors.isEmpty) {
        const error = new Error('Validation failed');
        error.errors = req.errors.errors;
        error.statusCode = 422;
        throw error;
    }
    const restaurantId = req.params.restaurantId;
    const {name, description, country, state, city, address} = req.body;
    Restaurant.findById(restaurantId)
        .then(restaurant => {
            if(!restaurant) {
                const error = new Error('Restaurant not found');
                error.statusCode = 404;
                throw error;
            }
            Object.assign(restaurant, {
                name,
                description,
                location: {
                    country,
                    state,
                    city,
                    address
                }
            });
            if(req.file) {
                if(restaurant.photoUrl !== DEFAULT_PHOTO) {
                    clearImage(restaurant.photoUrl);
                }
                restaurant.photoUrl = req.file.path.replace( /\\/g, '/');
            }
            return restaurant.save();
        })
        .then(restaurant => {
            res.status(200).json(restaurant);
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteRestaurant = (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    let currentPhotoUrl;
    Restaurant.findById(restaurantId)
        .then(restaurant => {
            if(!restaurant) {
                const error = new Error('Restaurant not found');
                error.statusCode = 404;
                throw error;
            }
            currentPhotoUrl = restaurant.photoUrl;
            return restaurant.remove();
        })
        .then(result => {
            clearImage(currentPhotoUrl);
            res.status(200).json({restaurant: result});
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        console.log(err);
    });
};

const resultReviews = (reviews) => {
    const numReviews = reviews.length;
    let rating = 0;
    if(numReviews) {
        rating = (reviews.reduce((acc, review) => (acc + review.rating), 0) / numReviews).toFixed(1);
    }
    return {
        rating,
        numReviews
    }
};

const filterParse = (filterTerm) => {
    let filter = {};
    if(filterTerm.match(/::/)) {
        const filterParsed = filterTerm.split('::');
        filter[filterParsed[0]] = filterParsed[1];
    } else {
        filter = { $or: [{name: filterTerm}, {'location.country': filterTerm}, {'location.city': filterTerm}]};
    }
    return filter;
};

const pipelineGetRestaurants = ({filter, sort, curPage, perPage}) => {
    return [
        { $match: {...filter} },
        { $sort: sort },
        { $skip: ((curPage - 1) * perPage) },
        { $limit: perPage },
        { $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'restaurant',
                as: 'reviews'
            }},
        { $unwind: {
                path: "$reviews",
                preserveNullAndEmptyArrays: true
            }},
        { $group: {
                _id: "$_id",
                name: {$first: '$name'},
                description: {$first: '$description'},
                photoUrl: {$first: '$photoUrl'},
                location: {$first: '$location'},
                createdAt: {$first: '$createdAt'},
                reviews: {$push: "$reviews"},
                avgRating: {$avg: "$reviews.rating"}
            }},
        { $project: {
                name: 1,
                description: 1,
                location: 1,
                createdAt: 1,
                photoUrl: 1,
                reviews: 1,
                avgRating: 1
            }},
    ];
};
