const express = require('express');

const router = express.Router();
const restaurantController = require('../controllers/restaurant');
const isValidRestaurant = require('../middlewares/validation/restaurant');
const userController = require('../controllers/user');
const reviewController = require('../controllers/review');
const { adminAuth } = require('../middlewares/auth');
const { uploadRestaurantPhoto } = require('../middlewares/image-upload');

router.get('/restaurants', adminAuth, restaurantController.getRestaurants);
router.get('/restaurants/:restaurantId', adminAuth, restaurantController.getRestaurant);
router.post('/restaurants', adminAuth, uploadRestaurantPhoto, isValidRestaurant, restaurantController.createRestaurant);
router.put('/restaurants/:restaurantId', adminAuth, uploadRestaurantPhoto, isValidRestaurant, restaurantController.updateRestaurant);
router.delete('/restaurants/:restaurantId', adminAuth, restaurantController.deleteRestaurant);

router.get('/users', adminAuth, userController.getUsers);
router.get('/users/:userId', adminAuth, userController.getUser);
router.put('/users/:userId', adminAuth, userController.updateUserStatus);
router.delete('/users/:userId', adminAuth, userController.deleteUser);

router.get('/reviews', adminAuth, reviewController.getReviews);
router.delete('/reviews/:reviewId', adminAuth, reviewController.deleteReview);

module.exports = router;
