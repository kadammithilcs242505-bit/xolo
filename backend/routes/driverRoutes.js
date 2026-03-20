const express = require('express');
const router = express.Router();
const { getDrivers, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, admin, getDrivers)
    .post(protect, admin, createDriver);

router.route('/:id')
    .put(protect, admin, updateDriver)
    .delete(protect, admin, deleteDriver);

module.exports = router;
