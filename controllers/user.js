const User = require('../models/user');

exports.getUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch((err) => console.log(err));
};

exports.getUser = (req, res, next) => {
    const userId = req.params.userId;
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
    // if(!req.errors.isEmpty) {
    //     return res.status(422).json({errors: req.errors.errors});
    // }
    const {username, email, password} = req.body;
    const user = new User({
        username: username.trim(),
        email: email.trim(),
        password: password.trim()
    });
    user.save()
        .then(user => {
            res.status(201).json(user);
        })
        .catch((err) => console.log(err));
};

exports.updateUser = (req, res, next) => {
    // if(!req.errors.isEmpty) {
    //     return res.status(422).json({errors: req.errors.errors});
    // }
    const userId = req.params.userId;
    const {username, email, password} = req.body;
    User.findById(userId)
        .then(user => {
            if(!user) {
                return res.status(404).json({message: "No user found"});
            }
            Object.assign(user, {
                username: username.trim(),
                email: email.trim(),
                password: password.trim()
            });
            return user.save();
        })
        .then(user => {
            res.status(200).json(user);
        })
        .catch((err) => console.log(err));
};

exports.deleteUser = (req, res, next) => {
    const userId = req.params.userId;
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
