const Ride = require('../models/Ride');
const Driver = require('../models/Driver');

// @desc    Create new ride
// @route   POST /api/rides
// @access  Customer
exports.createRide = async (req, res) => {
    try {
        const { pickupLocation, dropLocation, fare } = req.body;

        const ride = new Ride({
            customerId: req.user._id,
            pickupLocation,
            dropLocation,
            fare
        });

        const createdRide = await ride.save();
        res.status(201).json(createdRide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all rides
// @route   GET /api/rides
// @access  Admin/Customer
exports.getRides = async (req, res) => {
    try {
        // If customer, show only their rides
        if (req.user.role === 'customer') {
            const rides = await Ride.find({ customerId: req.user._id })
                .populate('driverId', 'name phone vehicleNumber')
                .sort({ createdAt: -1 });
            return res.json(rides);
        }

        // If admin, show all
        const rides = await Ride.find({})
            .populate('customerId', 'name phone')
            .populate('driverId', 'name phone vehicleNumber')
            .sort({ createdAt: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update ride status
// @route   PUT /api/rides/:id
// @access  Admin / Customer (for cancelling)
exports.updateRideStatus = async (req, res) => {
    try {
        const { rideStatus, driverId } = req.body;
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Only allow customers to cancel their own rides if not accepted or completed
        if (req.user.role === 'customer') {
            if (rideStatus === 'cancelled' && ride.rideStatus === 'requested') {
                ride.rideStatus = 'cancelled';
                await ride.save();
                return res.json(ride);
            } else {
                return res.status(400).json({ message: 'Cannot cancel ride at this stage' });
            }
        }

        // Admin updates
        ride.rideStatus = rideStatus || ride.rideStatus;
        if (driverId) {
            ride.driverId = driverId;
            // Update driver status to busy
            await Driver.findByIdAndUpdate(driverId, { status: 'busy' });
        }

        // If completed or cancelled by admin, free up driver
        if ((rideStatus === 'completed' || rideStatus === 'cancelled') && ride.driverId) {
            await Driver.findByIdAndUpdate(ride.driverId, { status: 'available' });
        }

        const updatedRide = await ride.save();

        // Return full populated ride back
        const populatedRide = await Ride.findById(updatedRide._id)
            .populate('customerId', 'name phone')
            .populate('driverId', 'name phone vehicleNumber');

        res.json(populatedRide);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
