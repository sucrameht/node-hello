const express = require('express');
const router = express.Router();

const {printHelloNode} = require('../controllers/helloNode');
    
router.get('/', printHelloNode);

module.exports = router;