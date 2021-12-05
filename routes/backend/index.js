const express = require('express');
const router = express.Router();

/* GET home page. */
router.use('/', require('./dashboard'));
router.use('/items', require('./items'));
router.use('/groups', require('./groups'));
router.use('/users', require('./users'));
router.use('/categories', require('./categories'));



module.exports = router;
