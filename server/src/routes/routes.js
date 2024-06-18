const router = require('express').Router();

router.get('/', (req, res) => {
    console.log('Hello world!');
    res.send('Hello world!');
});

module.exports = router;