const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { sortParse, filterParse, clearImage } = require('./helpers');
const DEFAULT_AVATAR = '/public/img/avatars/default.png';

exports.getUsers = (req, res, next) => {
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
    User.find({...filter})
        .countDocuments()
        .then(count => {
            totalNumber = count;
            return User.find({...filter}, {}, {
                limit: perPage,
                skip: ((curPage - 1) * perPage),
                sort
            })
                .populate({
                    path: 'reviews'
                });
        })
        .then(users => {
            users = users.map(user => ({user, numReviews: user.reviews.length}));
            res.status(200).json({users, totalNumber});
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getUser = (req, res, next) => {
    const userId = req.userId || req.params.userId;
    User.findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            return user.populate({
                path: 'reviews'
            })
                .execPopulate();
        })
        .then(user => {
            res.status(200).json({user, reviews: user.reviews});
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createUser = (req, res, next) => {
    if (!req.errors.isEmpty) {
        const error = new Error('Validation failed');
        error.errors = req.errors.errors;
        error.statusCode = 422;
        throw error;
    }
    const {username, email, password} = req.body;
    const photoUrl = DEFAULT_AVATAR;
    return User.findOne({email})
        .then((userInDB) => {
            if (userInDB) {
                const error = new Error('Validation failed');
                error.errors = {email: 'Email address already exists'};
                error.statusCode = 422;
                throw error;
            }
            return bcrypt.hash(password.trim(), 12);
        })
        .then(hashedPass => {
            const user = new User({
                username,
                email,
                password: hashedPass,
                photoUrl
            });
            return user.save();
        })
        .then(user => {
            res.status(201).json(user);
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateUser = (req, res, next) => {
    if(!req.errors.isEmpty) {
        const error = new Error('Validation failed');
        error.errors = req.errors.errors;
        error.statusCode = 422;
        throw error;
    }
    const userId = req.userId || req.params.userId;
    const { username, email, password } = req.body;
    let currentUser;
    User.findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            currentUser = user;
            return User.findOne({email});
        })
        .then(user => {
            if(user && user._id.toString() !== userId ) {
                const error = new Error('Validation failed');
                error.errors = {email: 'Email address already exists'};
                error.statusCode = 422;
                throw error;
            }
            if(!password) {
                Object.assign(currentUser, {
                    username,
                    email
                });
                return currentUser.save();
            }
            bcrypt.hash(password.trim(), 12)
                .then(hashedPass => {
                    Object.assign(currentUser, {
                        username,
                        email,
                        password: hashedPass
                    });
                    return currentUser.save();
                })
        })
        .then(() => {
            res.status(200).json(currentUser);
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteUser = (req, res, next) => {
    const userId = req.userId || req.params.userId;
    User.findById(userId)
        .then(user => {
            if(!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            return user.remove(userId);
        })
        .then(user => {
            if(user.photoUrl !== DEFAULT_AVATAR) {
                clearImage(user.photoUrl);
            }
            res.status(200).json(user);
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateUserStatus = (req, res, next) => {
    const userId = req.params.userId;
    const {status} = req.body;
    User.findById(userId)
        .then(user => {
            if(!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            Object.assign(user, {
                status
            });
            return user.save();
        })
        .then(user => {
            res.status(200).json(user);
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.setAvatar = (req, res, next) => {
    const photoUrl = req.file.path.replace( /\\/g, '/');
    let pastPhotoUrl;
    User.findById(req.userId)
        .then(user => {
            if(!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            pastPhotoUrl = user.photoUrl;
            Object.assign(user, {
                photoUrl
            });
            return user.save();
        })
        .then(user => {
            if(pastPhotoUrl !== DEFAULT_AVATAR) {
                clearImage(pastPhotoUrl);
            }
            res.status(200).json(user);
        })
        .catch((err) => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
