module.exports = (error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const errors = error.errors;
    res.status(status).json({message, errors});
};
