const express = require('express');

const router = express.Router();

router.get('/restaurants');
router.get('/restaurants/:restaurantId');

router.get('/profile/:userId');
router.patch('/profile/:userId');
router.delete('/profile/:userId');

router.get('/reviews');
router.post('/reviews');
router.patch('/reviews/:reviewId');
router.delete('/reviews/:reviewId');
