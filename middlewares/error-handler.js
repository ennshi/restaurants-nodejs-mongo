module.exports = (error, req, res, next) => {
    console.log(error.message);
    const status = error.statusCode || 500;
    const errors = error.errors || {server: 'Server error. Please, try again later'};
    res.status(status).json({errors});
};
