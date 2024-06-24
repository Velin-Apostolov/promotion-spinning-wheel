const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    prize: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    used: {
        type: Boolean,
        default: false,
    },
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;