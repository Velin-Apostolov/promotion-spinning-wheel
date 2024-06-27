const router = require('express').Router();
const Coupon = require('../models/coupons/Coupon');

router.post('/promo/check', async (req, res) => {
    const { code } = req.body;
    try {
        const coupon = await Coupon.findOne({ code });
        if (!coupon) {
            return res.json({ message: "Not found!" });
        }
        const used = coupon.used;
        res.json(used);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/promo/add', async (req, res) => {
    const { code, expiryDate, hasSpun, currentPrize, prizeNumber } = req.body;
    try {
        const coupon = new Coupon({
            code,
            prize: currentPrize,
            expiryDate,
        });
        await coupon.save();
        res.json({ code, expiryDate, hasSpun, currentPrize, prizeNumber });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/admin/check', async (req, res) => {
    const { code } = req.body;
    if (!code || code.trim() === '') {
        return res.json({ message: 'Coupon code cannot be empty' });
    }
    try {
        const coupon = await Coupon.findOne({ couponCode });
        if (!coupon) { return res.json({ message: `Coupon not found - ${couponCode}` }) };
        res.json(coupon);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;