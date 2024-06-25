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
    const newDate = new Date(expiryDate);
    try {
        const coupon = new Coupon({
            code,
            prize: currentPrize,
            expiryDate,
        });
        await coupon.save();
        res.cookie('promoCode', code, { expires: newDate });
        res.cookie('prizeNumber', prizeNumber, { expires: newDate });
        res.cookie('currentPrize', currentPrize, { expires: newDate });
        res.cookie('hasSpun', hasSpun, { expires: newDate });
        res.cookie('expiryDate', expiryDate, { expires: newDate });
        res.json(coupon);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;