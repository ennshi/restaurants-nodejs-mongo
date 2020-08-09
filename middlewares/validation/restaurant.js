const {isLength, isValidCountryStateCity} = require('./helpers');
const isValidRestaurant = (req, res, next) => {
    const errors = {};
    const {name, description, country, state, city, address} = req.body;
    if(!isLength(name.trim(), {min: 1, max: 255})) {
        errors.name = "Please provide a name 1-255 characters long";
    }
    if(!isLength(description.trim(), {min: 10, max: 300})) {
        errors.description = "Please provide a description 10-300 characters long";
    }
    if(!isLength(address.trim(), {min: 10, max: 300})) {
        errors.address = "Please provide a valid address 10-300 characters long";
    }
    if(!isLength(country.trim(), {min: 3})) {
        errors.country = "Please choose country from the list";
    }
    if(!isLength(state.trim(), {min: 2})) {
        errors.state = "Please choose state from the list";
    }
    if(!isLength(city.trim(), {min: 1})) {
        errors.city = "Please choose city from the list";
    }
    if(!isValidCountryStateCity({
        country: country.trim(),
        state: state.trim(),
        city: city.trim()
    })){
        errors.city = "Please choose country, state and city from the lists";
    }
    const isEmpty = !Object.keys(errors).length;
    req.errors = {errors, isEmpty};
    next();
};

module.exports = isValidRestaurant;
