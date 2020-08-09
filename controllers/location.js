const ccsj = require('countrycitystatejson');
exports.getCountries = (req, res, next) => {
    const term = req.query.country.trim();
    if(term.length <= 1) {
        const error = new Error('Country not found');
        error.statusCode = 404;
        throw error;
    }
    const countryName = new RegExp(term, 'i');
    const countries = ccsj.getCountries().filter(country => country.name.match(countryName)).map(country => country.name);
    res.status(200).json({countries});

};

exports.getStates = (req, res, next) => {
    const {country} = req.query;
    const countryFromDB = ccsj.getCountries().find(c => c.name.match(country));
    if(!countryFromDB) {
        const error = new Error('Country not found');
        error.statusCode = 404;
        throw error;
    }
    const {states} = ccsj.getCountryByShort(countryFromDB.shortName);
    for (const state in states) {
        if(states.hasOwnProperty(state)) {
            states[state] = states[state].map(city => city.name);
        }
    }
    res.status(200).json({country, states});
};
