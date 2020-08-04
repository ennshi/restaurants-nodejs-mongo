const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.loginUser = (req, res, next) => {
    const { email, password } = req.body;
    let currentUser;
    User.findOne({ email })
        .then(user => {
            if(!user) {
                return res.status(404).json({message: "Email isn't registered or password is incorrect"});
            }
            currentUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if(!isEqual) {
                return res.status(404).json({message: "Email isn't registered or password is incorrect"});
            }
            const key = process.env.JWT_KEY;
            const token = jwt.sign({
                    userId: currentUser._id.toString(),
                    email: currentUser.email
                },
                key,
                {expiresIn: '1h'}
                );
            res.status(200).json({ token, userId: currentUser._id });
        })
        .catch(err => {
            console.log(err);
        });
};
