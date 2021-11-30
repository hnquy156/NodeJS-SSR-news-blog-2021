const express = require('express');
const router = express.Router();

/* GET home page. */
router.use('/', require('./dashboard'));
router.use('/items', require('./items'));



module.exports = router;
