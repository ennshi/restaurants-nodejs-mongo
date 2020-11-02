const {isLength} = require('../middlewares/validation/helpers');

test('Should return false if empty line', () => {
    expect(isLength('', {min: 5, max: 13})).toBe(false);
});

test('Should return true if enough characters and just min indicated', () => {
    expect(isLength('123eed', {min: 5})).toBe(true);
});

test('Should return true if enough characters and just max indicated', () => {
    expect(isLength('123eed', {max: 7})).toBe(true);
});

test('Should return true if enough characters and both max and min indicated', () => {
    expect(isLength('12dkmnild', {min: 5, max: 13})).toBe(true);
});
