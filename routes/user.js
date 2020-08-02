const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');
const isValidUser = require('../middlewares/validation/user');

// router.get('/restaurants');
// router.get('/restaurants/:restaurantId');

router.post('/profile', isValidUser, userController.createUser);
router.get('/profile/:userId', userController.getUser);
router.put('/profile/:userId', isValidUser, userController.updateUser);
router.delete('/profile/:userId', userController.deleteUser);

// router.get('/reviews');
// router.post('/reviews');
// router.patch('/reviews/:reviewId');
// router.delete('/reviews/:reviewId');

module.exports = router;
