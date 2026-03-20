const Driver = require('../models/Driver');

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Admin
exports.getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find({});
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a driver
// @route   POST /api/drivers
// @access  Admin
exports.createDriver = async (req, res) => {
    try {
        const { name, phone, vehicleNumber, vehicleType, status } = req.body;

        const driver = new Driver({
            name,
            phone,
            vehicleNumber,
            vehicleType,
            status: status || 'available'
        });

        const createdDriver = await driver.save();
        res.status(201).json(createdDriver);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a driver
// @route   PUT /api/drivers/:id
// @access  Admin
exports.updateDriver = async (req, res) => {
    try {
        const { name, phone, vehicleNumber, vehicleType, status } = req.body;

        const driver = await Driver.findById(req.params.id);

        if (driver) {
            driver.name = name || driver.name;
            driver.phone = phone || driver.phone;
            driver.vehicleNumber = vehicleNumber || driver.vehicleNumber;
            driver.vehicleType = vehicleType || driver.vehicleType;
            driver.status = status || driver.status;

            const updatedDriver = await driver.save();
            res.json(updatedDriver);
        } else {
            res.status(404).json({ message: 'Driver not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a driver
// @route   DELETE /api/drivers/:id
// @access  Admin
exports.deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);

        if (driver) {
            await driver.deleteOne();
            res.json({ message: 'Driver removed' });
        } else {
            res.status(404).json({ message: 'Driver not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
