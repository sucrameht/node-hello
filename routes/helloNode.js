const express = require('express');
const router = express.Router();

const {helloNode, printHelloNode} = require('../controllers/helloNode');
    
router.get('/', printHelloNode);

module.exports = router;