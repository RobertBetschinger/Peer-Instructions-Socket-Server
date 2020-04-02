const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('The Server Is Running.')
    res.send('This Server is an API for an IT-Security Workshop of the University of Regensburg')
});

module.exports =router;