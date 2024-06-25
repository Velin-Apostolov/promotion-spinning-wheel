const router = require('express').Router();
const couponController = require('../controllers/couponController');

router.use(couponController);

module.exports = router;