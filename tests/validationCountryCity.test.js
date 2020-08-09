const {isValidCountryStateCity} = require('../middlewares/validation/helpers');

test('Should be truthy if valid object', () => {
    expect(isValidCountryStateCity({country: 'France', state: 'Ain', city: 'Amberieu-en-Bugey'})).toBeTruthy();
});

test('Should be truthy if invalid object', () => {
    expect(isValidCountryStateCity({country: 'France', state: 'Ain', city: 'Amberieu-en'})).toBeFalsy();
});

test('Should be truthy if invalid object', () => {
    expect(isValidCountryStateCity({country: 'France', state: 'Ainsss', city: 'Amberieu-en'})).toBeFalsy();
});

test('Should be truthy if invalid object', () => {
    expect(isValidCountryStateCity({country: 'Fra', state: 'Ainsss', city: 'Amberieu-en'})).toBeFalsy();
});
