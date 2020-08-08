const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const path = require('path');

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
        cb(new Error('Please upload right format.'))
    }
};

exports.uploadAvatar = multer({
    limits: {
        fileSize: 2000000
    },
    storage: storage('avatars'),
    fileFilter
})
    .single('avatar');

