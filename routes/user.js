const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');
const isValidUser = require('../middlewares/validation/user');
const restaurantController = require('../controllers/restaurant');
const reviewController = require('../controllers/review');

router.get('/restaurants', restaurantController.getRestaurants);
router.get('/restaurants/:restaurantId', restaurantController.getRestaurant);

router.post('/profile', isValidUser, userController.createUser);
router.get('/profile/:userId', userController.getUser);
router.put('/profile/:userId', isValidUser, userController.updateUser);
router.delete('/profile/:userId', userController.deleteUser);

router.get('/reviews', reviewController.getReviews);
router.post('/reviews', reviewController.createReview);
router.put('/reviews/:reviewId', reviewController.updateReview);
router.delete('/reviews/:reviewId', reviewController.deleteReview);

module.exports = router;
