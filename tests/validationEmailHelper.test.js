const {isValidEmail} = require('../middlewares/validation/helpers');

test('Should return true if the valid email', () => {
    expect(isValidEmail('ennie@gmail.com')).toBe(true);
});

test('Should return true if invalid email', () => {
    expect(isValidEmail('ennie@gmail')).toBe(false);
});

test('Should return true if invalid email', () => {
    expect(isValidEmail('ennie.com')).toBe(false);
});

test('Should return true if invalid email', () => {
    expect(isValidEmail('@gmail.com')).toBe(false);
});
