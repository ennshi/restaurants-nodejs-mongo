const express = require('express');

const router = express.Router();
const restaurantController = require('../controllers/restaurant');

router.get('/restaurants', restaurantController.getRestaurants);
router.get('/restaurants/:restaurantId', restaurantController.getRestaurant);
router.post('/restaurants', restaurantController.createRestaurant);
router.put('/restaurants/:restaurantId', restaurantController.updateRestaurant);
router.delete('/restaurants/:restaurantId', restaurantController.deleteRestaurant);

// router.get('/users');
// router.get('/users/:userId');
// router.patch('/users/:userId');
// router.delete('/users/:userId');
//
// router.get('/reviews');
// router.delete('/reviews/:reviewId');

module.exports = router;
