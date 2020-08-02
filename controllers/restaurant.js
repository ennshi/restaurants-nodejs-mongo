const Restaurant = require('../models/restaurant');

exports.getRestaurants = (req, res, next) => {
    Restaurant.find()
        .then(restaurants => {
            res.status(200).json(restaurants);
        })
        .catch((err) => console.log(err));
};

exports.getRestaurant = (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    Restaurant.findById(restaurantId)
        .then(restaurant => {
            if(!restaurant) {
                res.status(404).json({message: "No restaurant found"});
            }
            res.status(200).json(restaurant);
        })
        .catch((err) => console.log(err));
};

exports.createRestaurant = (req, res, next) => {
    if(!req.errors.isEmpty) {
        return res.status(422).json({errors: req.errors.errors});
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
        .catch((err) => console.log(err));
};

exports.updateRestaurant = (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    const {name, description, country, city, address, photoUrl} = req.body;
    Restaurant.findById(restaurantId)
        .then(restaurant => {
            if(!restaurant) {
                res.status(404).json({message: "No restaurant found"});
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
        .catch((err) => console.log(err));
};

exports.deleteRestaurant = (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    Restaurant.findById(restaurantId)
        .then(restaurant => {
            if(!restaurant) {
                return res.status(404).json({message: "No restaurant found"});
            }
            return Restaurant.findByIdAndRemove(restaurantId);
        })
        .then(result => {
            res.status(200).json({restaurant: result});
        })
        .catch((err) => console.log(err));
};
