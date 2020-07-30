const express = require('express');

const router = express.Router();

router.get('/restaurants');
router.get('/restaurants/:restaurantId');
router.post('/restaurants');
router.patch('/restaurants/:restaurantId');
router.delete('/restaurants/:restaurantId');

router.get('/users');
router.get('/users/:userId');
router.patch('/users/:userId');
router.delete('/users/:userId');

router.get('/reviews');
router.delete('/reviews/:reviewId');
