const {isLength} = require('./helpers');
const isValidRestaurant = (req, res, next) => {
    const errors = {};
    const {name, description, address} = req.body;
    if(!isLength(name.trim(), {min: 1, max: 255})) {
        errors.name = "Please provide a name 1-255 characters long";
    }
    if(!isLength(description.trim(), {min: 10, max: 300})) {
        errors.description = "Please provide a description 10-300 characters long";
    }
    if(!isLength(address.trim(), {min: 10, max: 300})) {
        errors.address = "Please provide a valid address 10-300 characters long";
    }

    const isEmpty = !Object.keys(errors).length;
    req.errors = {errors, isEmpty};
    next();
};

module.exports = isValidRestaurant;
