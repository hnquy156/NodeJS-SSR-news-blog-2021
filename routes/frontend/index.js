const express = require('express');
const router = express.Router();

/* GET home page. */
router.use('/', require('./home'));
router.use('/articles', require('./articles'));
router.use('/category', require('./category'));



module.exports = router;
