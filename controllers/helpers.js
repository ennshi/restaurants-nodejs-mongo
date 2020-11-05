const path = require('path');
const fs = require('fs');

exports.sortParse = (sortTerm) => {
    let sort = {};
    const sortParsed = sortTerm.split('::');
    sort[sortParsed[0]] = sortParsed[1] === 'asc' ? 1 : -1;
    return sort;
};

exports.filterParse = (filterTerm) => {
    let filter = {};
    const filterParsed = filterTerm.split('::');
    filter[filterParsed[0]] = filterParsed[1];
    return filter;
};

exports.clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        console.log(err);
    });
};

exports.createError = (status, message, errors) => {
    const newErr = new Error(message);
    newErr.statusCode = status;
    newErr.errors = errors ? errors : {server: message};
    return newErr;
};
