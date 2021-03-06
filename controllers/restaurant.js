const Restaurant = require('../models/restaurant');
const {sortParse, clearImage, createError} = require('./helpers');
const {minifyAndResize} = require('../middlewares/image-upload');
const DEFAULT_PHOTO = 'public/img/restaurants/default.png';

exports.getRestaurants = (req, res, next) => {
    const curPage = +req.query.page || 1;
    const perPage = +req.query.limits || 6;
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
            res.status(200).json({restaurants, totalNumber});
        })
        .catch((err) => {
            next(err);
        });
};

exports.getRestaurant = (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    Restaurant.findById(restaurantId)
        .then(restaurant => {
            if (!restaurant) {
                throw createError(404, 'Restaurant not found');
            }
            return restaurant.populate({
                path: 'reviews'
            })
                .execPopulate();
        })
        .then(restaurant => {
            res.status(200).json({
                restaurant: {...restaurant._doc, ...resultReviews(restaurant.reviews)},
                reviews: restaurant.reviews
            });
        })
        .catch((err) => {
            next(err);
        });
};

exports.createRestaurant = (req, res, next) => {
    if(!req.errors.isEmpty) {
        throw createError(422, 'Validation failed', req.errors.errors);
    }
    const {name, description, address, featured} = req.body;
    const photoUrl = req.file ? `${req.file.path.replace( /\\/g, '/').split('.')[0]}-optimized.jpeg` : DEFAULT_PHOTO;
    const restaurant = new Restaurant({
        name,
        description,
        photoUrl,
        featured,
        address
    });
    if(req.file) {
        minifyAndResize(req.file, 560)
            .catch(() => {
                next(createError(422, 'Image error'));
            });
    }
    restaurant.save()
        .then(restaurant => {
            res.status(201).json(restaurant);
        })
        .catch((err) => {
            next(err);
        });
};

exports.updateRestaurant = (req, res, next) => {
    if(!req.errors.isEmpty) {
        throw createError(422, 'Validation failed', req.errors.errors);
    }
    const restaurantId = req.params.restaurantId;
    const {name, description, address, featured} = req.body;
    Restaurant.findById(restaurantId)
        .then(restaurant => {
            if(!restaurant) {
                throw createError(404, 'Restaurant not found');
            }
            Object.assign(restaurant, {
                name,
                description,
                address,
                featured
            });
            if(req.file) {
                if(restaurant.photoUrl !== DEFAULT_PHOTO) {
                    clearImage(restaurant.photoUrl);
                }
                restaurant.photoUrl = `${req.file.path.replace( /\\/g, '/').split('.')[0]}-optimized.jpeg`;
                minifyAndResize(req.file, 560)
                    .catch(() => {
                        next(createError(422, 'Image error'));
                    });
            }
            return restaurant.save();
        })
        .then(restaurant => {
            res.status(200).json(restaurant);
        })
        .catch((err) => {
            next(err);
        });
};

exports.deleteRestaurant = (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    let currentPhotoUrl;
    Restaurant.findById(restaurantId)
        .then(restaurant => {
            if(!restaurant) {
                throw createError(404, 'Restaurant not found');
            }
            currentPhotoUrl = restaurant.photoUrl;
            return restaurant.remove();
        })
        .then(result => {
            clearImage(currentPhotoUrl);
            res.status(200).json({restaurant: result});
        })
        .catch((err) => {
            next(err);
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
        if(filterParsed[0] === 'featured') {
            filter[filterParsed[0]] = (filterParsed[1] === 'true');
        } else {
            filter[filterParsed[0]] = filterParsed[1];
        }
        return filter;
    }
    let regexpFilter = '';
    if(filterTerm.match(/[-_ ,]/)) {
        filterTerm.split(/[-_ ,]/).forEach(word => {
            if(word) {
                regexpFilter += `(?=.*${word}($|[-_ ,]))`;
            }
        });
    } else {
        regexpFilter = `${filterTerm}($|[-_ ,])`;
    }
    const searchObj = {$regex : regexpFilter, $options: 'i'};
    filter = { searchField: {...searchObj} };
    return filter;
};

const pipelineGetRestaurants = ({filter, sort, curPage, perPage}) => {
    return [
        { $match: {...filter} },
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
        { $sort: {...sort, name: 1} },
        { $skip: ((curPage - 1) * perPage) },
        { $limit: perPage },
    ];
};
