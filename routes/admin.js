const express = require('express');

const router = express.Router();
const restaurantController = require('../controllers/restaurant');
const isValidRestaurant = require('../middlewares/validation/restaurant');
const userController = require('../controllers/user');
const reviewController = require('../controllers/review');

router.get('/restaurants', restaurantController.getRestaurants);
router.get('/restaurants/:restaurantId', restaurantController.getRestaurant);
router.post('/restaurants', isValidRestaurant, restaurantController.createRestaurant);
router.put('/restaurants/:restaurantId', isValidRestaurant, restaurantController.updateRestaurant);
router.delete('/restaurants/:restaurantId', restaurantController.deleteRestaurant);

router.get('/users', userController.getUsers);
router.get('/users/:userId', userController.getUser);
router.put('/users/:userId', userController.updateUserStatus);
router.delete('/users/:userId', userController.deleteUser);

router.get('/reviews', reviewController.getReviews);
router.delete('/reviews/:reviewId', reviewController.deleteReview);

module.exports = router;
