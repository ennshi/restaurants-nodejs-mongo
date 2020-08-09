const express = require('express');

const locationController = require('../controllers/location');
const router = express.Router();

router.get('/countries', locationController.getCountries);
router.get('/states', locationController.getStates);

module.exports = router;
