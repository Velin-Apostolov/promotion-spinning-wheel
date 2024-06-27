const router = require('express').Router();
const User = require('../models/users/User');

router.post('/user/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ message: 'Invalid credentials' });
        }
        const passwordMatch = password == user.password;
        if (!passwordMatch) {
            return res.json({ message: 'Invalid credentials' });
        }
        return res.json({ message: 'Successful login!' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;