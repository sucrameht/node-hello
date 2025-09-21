const express = require('express');
const router = express.Router();

const {getServerTime} = require('../controllers/serverTime');
    
router.get('/server-time', getServerTime);

module.exports = router;