const ccsj = require('countrycitystatejson');

exports.isLength = (trimmedText, {min = null, max = null}) => {
    const trimmedTextLength = trimmedText.length;
    let isValid = min ? (trimmedTextLength > min) : true;
    isValid = max ? ((trimmedTextLength < max) && isValid) : isValid;
    return isValid;
};

exports.isValidEmail = (trimmedEmail) => {
    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(trimmedEmail);
};

exports.isValidPassword = (trimmedPassword) => {
    const regexp = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    return regexp.test(trimmedPassword);
};

exports.isValidRating = (number, maxNumber) => {
    return (number >= 0) && (number <= maxNumber);
};

exports.isValidCountryStateCity = ({country, state, city}) => {
    const regExp = new RegExp(country, 'gi');
    const countryFromDB = ccsj.getCountries().find(c => c.name.match(regExp));
    if(!countryFromDB) {
        return false;
    }
    const countryObj = ccsj.getCountryByShort(countryFromDB.shortName);
    if(!countryObj.states.hasOwnProperty(state)) {
        return false;
    }
    return countryObj.states[state].find(c => c.name === city);
};
