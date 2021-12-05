const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('(/dashboard)?', function (req, res, next) {
	res.locals.sidebarActive = `dashboard|list`;;
	res.render('backend/pages/dashboard', { pageTitle: 'Dashboard' });
});

module.exports = router;
