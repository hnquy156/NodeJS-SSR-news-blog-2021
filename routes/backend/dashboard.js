const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('(/dashboard)?', function (req, res, next) {
	res.render('backend/pages/dashboard', { pageTitle: 'Express' });
});

/* GET users listing. */
router.get('/users', function (req, res, next) {
	res.send('respond with a resource');
});

module.exports = router;
