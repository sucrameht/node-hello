const express = require('express');
const router = express.Router();

const {getHealth} = require('../controllers/getHealth');
    
router.get('/health', getHealth);

module.exports = router;