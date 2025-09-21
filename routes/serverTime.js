const express = require('express');
const router = express.Router();

const {getTime, getServerTime} = require('../controllers/serverTime');
    
router.get('/serverTime', getServerTime);

module.exports = router;