const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');
const isValidUser = require('../middlewares/validation/user');
const restaurantController = require('../controllers/restaurant');
const reviewController = require('../controllers/review');
const isValidReview = require('../middlewares/validation/review');
const { userAuth } = require('../middlewares/auth');

router.get('/restaurants', restaurantController.getRestaurants);
router.get('/restaurants/:restaurantId', restaurantController.getRestaurant);

router.post('/profile', isValidUser, userController.createUser);
router.get('/profile', userAuth, userController.getUser);
router.put('/profile', userAuth, isValidUser, userController.updateUser);
router.delete('/profile', userAuth, userController.deleteUser);

router.post('/reviews', userAuth, isValidReview, reviewController.createReview);
router.put('/reviews/:reviewId', userAuth, isValidReview, reviewController.updateReview);
router.delete('/reviews/:reviewId', userAuth, reviewController.deleteReview);

module.exports = router;
