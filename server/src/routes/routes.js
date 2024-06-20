const router = require('express').Router();
const User = require('../models/users/User');

router.get('/', async (req, res) => {
    const user = await User.findOne({ username: 'mariococo' }).lean();
    res.send(`Hi! Username: ${user.username}, ${user._id}`);
});

module.exports = router;