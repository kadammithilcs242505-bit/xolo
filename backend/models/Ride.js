const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    fare: { type: Number, required: true },
    rideStatus: {
        type: String,
        enum: ['requested', 'accepted', 'completed', 'cancelled'],
        default: 'requested'
    },
    bookingDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
