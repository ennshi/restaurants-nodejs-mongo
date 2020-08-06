const Restaurant = require('../models/restaurant');

exports.getRestaurants = (req, res, next) => {
    Restaurant.find()
        .then(restaurants => {
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
            res.status(200).json({ restaurant, reviews: restaurant.reviews});
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
    const {name, description, country, city, address, photoUrl} = req.body;
    const restaurant = new Restaurant({
        name,
        description,
        photoUrl,
        location: {
            country,
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
    const {name, description, country, city, address, photoUrl} = req.body;
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
                photoUrl,
                location: {
                    country,
                    city,
                    address
                }
            });
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
    Restaurant.findById(restaurantId)
        .then(restaurant => {
            if(!restaurant) {
                const error = new Error('Restaurant not found');
                error.statusCode = 404;
                throw error;
            }
            return restaurant.remove();
        })
        .then(result => {
            res.status(200).json({restaurant: result});
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
