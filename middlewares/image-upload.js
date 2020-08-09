const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const path = require('path');

const errorHandler = require('./error-handler');

const storage = (destDir) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join('public', 'img', destDir));
        },
        filename: (req, file, cb) => {
            cb(null, uuidv4() + path.extname(file.originalname));
        }
    })
};

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Please upload right format (png, jpg, jpeg).'))
    }
};

exports.uploadAvatar = (req, res, next) => {
    multer({
        limits: {
            fileSize: 2000000
        },
        storage: storage('avatars'),
        fileFilter
    })
        .single('avatar')(req, res, (err) => {
            if (err) {
                err.statusCode = 422;
                return errorHandler(err, req, res);
            }
            next();
        });
};

exports.uploadRestaurantPhoto = (req, res, next) => {
    multer({
        limits: {
            fileSize: 2000000
        },
        storage: storage('restaurants'),
        fileFilter
    })
        .single('image')(req, res, (err) => {
            if (err) {
                err.statusCode = 422;
                return errorHandler(err, req, res);
            }
            next();
        });
};
