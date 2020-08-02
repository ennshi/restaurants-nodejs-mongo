const {isLength, isValidEmail, isValidPassword} = require('./helpers');

const isValidUser = (req, res, next) => {
    const errors = {};
    const {username, email, password, repeatedPassword} = req.body;
    if(!isLength(username.trim(), {min: 5, max: 100})) {
        errors.username = "Please provide a username 5-100 characters long";
    }
    if(!isValidEmail(email.trim())) {
        errors.email = "Please provide a valid email address";
    }
    if(!isValidPassword(password.trim())) {
        errors.password = "Password must be between 7 to 15 characters and contain at least one numeric digit and a special character";
    }
    if(password !== repeatedPassword) {
        errors.repeatedPassword = "Passwords must match";
    }
    const isEmpty = !Object.keys(errors).length;
    req.errors = {errors, isEmpty};
    next();
};

module.exports = isValidUser;
