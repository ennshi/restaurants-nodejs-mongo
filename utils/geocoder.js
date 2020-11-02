const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'mapquest',
    apiKey: 'YjZcCASrOnCaCECf6PqvA37aryQx3GGe',
    formatter: null
};
const geocoder = NodeGeocoder(options);

module.exports = geocoder;
