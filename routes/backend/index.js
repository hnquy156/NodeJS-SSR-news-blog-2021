const express = require('express');
const router = express.Router();

/* GET home page. */
router.use('/', require('./dashboard'));
router.use('/items', require('./items'));
router.use('/groups', require('./groups'));
router.use('/users', require('./users'));
router.use('/categories', require('./categories'));
router.use('/articles', require('./articles'));
router.use('/contacts', require('./contacts'));
router.use('/settings', require('./settings'));



module.exports = router;
