const express = require('express');
const router = express.Router();
const { createRide, getRides, updateRideStatus } = require('../controllers/rideController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, createRide)
    .get(protect, getRides);

router.route('/:id')
    .put(protect, updateRideStatus);

module.exports = router;
