const router = require('express').Router();
const couponController = require('../controllers/couponController');
const userController = require('../controllers/userController');

router.use(couponController);
router.use(userController);

module.exports = router;