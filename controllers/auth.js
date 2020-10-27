const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Admin = require('../models/admin');

exports.loginUser = (req, res, next) => {
    const { email, password } = req.body;
    let currentUser;
    User.findOne({ email })
        .then(user => {
            if(!user) {
                return res.status(404).json({errors: {
                        auth: "Email isn't registered or password is incorrect"
                    }});
            }
            currentUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if(!isEqual) {
                return res.status(404).json({errors: {
                    auth: "Email isn't registered or password is incorrect"
                }});
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

exports.loginAdmin = (req, res, next) => {
    const { identifier, password } = req.body;
    let loggedAdmin;
    Admin.findOne({ identifier })
        .then(admin => {
            if(!admin) {
                return res.status(404).json({errors: {
                    auth: "Identifier isn't registered or password is incorrect"
                }});
            }
            loggedAdmin = admin;
            return bcrypt.compare(password, admin.password);
        })
        .then(isEqual => {
            if(!isEqual) {
                return res.status(404).json({errors: {
                    auth: "Identifier isn't registered or password is incorrect"
                }});
            }
            const key = process.env.JWT_KEY_A;
            const token = jwt.sign({
                    adminId: loggedAdmin._id.toString(),
                    identifier: loggedAdmin.identifier
                },
                key,
                {expiresIn: '1h'}
            );
            res.status(200).json({ token, adminId: loggedAdmin._id });
        })
        .catch(err => {
            console.log(err);
        });
};
