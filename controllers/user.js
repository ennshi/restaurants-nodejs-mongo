const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch((err) => console.log(err));
};

exports.getUser = (req, res, next) => {
    const userId = req.userId || req.params.userId;
    User.findById(userId)
        .then(user => {
            if(!user) {
                return res.status(404).json({message: "No user found"});
            }
            res.status(200).json(user);
        })
        .catch((err) => console.log(err));
};

exports.createUser = (req, res, next) => {
    if (!req.errors.isEmpty) {
        return res.status(422).json({errors: req.errors.errors});
    }
    const {username, email, password} = req.body;
    const photoUrl = req.body.photoUrl || '/images/default.png';
    return User.findOne({email})
        .then((userInDB) => {
            if (userInDB) {
                return res.status(422).json({errors: {email: "Email address already exists"}});
            }
            return bcrypt.hash(password.trim(), 12);
        })
        .then(hashedPass => {
            const user = new User({
                username: username.trim(),
                email: email.trim(),
                password: hashedPass,
                photoUrl
            });
            return user.save();
        })
        .then(user => {
            res.status(201).json(user);
        })
        .catch((err) => console.log(err));
};

exports.updateUser = (req, res, next) => {
    if(!req.errors.isEmpty) {
         return res.status(422).json({errors: req.errors.errors});
    }
    const userId = req.userId || req.params.userId;
    const { username, email, password } = req.body;
    const photoUrl = req.body.photoUrl || '/images/default.png';
    let currentUser;
    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({message: "No user found"});
            }
            currentUser = user;
            return User.findOne({email});
        })
        .then(user => {
            if(user && user._id.toString() !== userId ) {
                return res.status(422).json({errors: {email: "Email address already exists"}});
            }
            if(!password) {
                Object.assign(currentUser, {
                    username: username.trim(),
                    email: email.trim(),
                    photoUrl
                });
                return currentUser.save();
            }
            bcrypt.hash(password.trim(), 12)
                .then(hashedPass => {
                    Object.assign(currentUser, {
                        username: username.trim(),
                        email: email.trim(),
                        password: hashedPass,
                        photoUrl
                    });
                    return currentUser.save();
                })
        })
        .then(() => {
            res.status(200).json(currentUser);
        })
        .catch((err) => console.log(err));
};

exports.deleteUser = (req, res, next) => {
    const userId = req.userId || req.params.userId;
    User.findById(userId)
        .then(user => {
            if(!user) {
                return res.status(404).json({message: "No user found"});
            }
            return User.findByIdAndRemove(userId);
        })
        .then(user => {
            res.status(200).json({ user });
        })
        .catch((err) => console.log(err));
};

exports.updateUserStatus = (req, res, next) => {
    const userId = req.params.userId;
    const {status} = req.body;
    User.findById(userId)
        .then(user => {
            if(!user) {
                return res.status(404).json({message: "No user found"});
            }
            Object.assign(user, {
                status
            });
            return user.save();
        })
        .then(user => {
            res.status(200).json(user);
        })
        .catch((err) => console.log(err));
};
