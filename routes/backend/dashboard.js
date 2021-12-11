const express = require('express');
const router = express.Router();

const systemConfigs = require(__path_configs + 'system');

/* GET home page. */
router.get('(/dashboard)?', async (req, res, next) => {
	let managements = [...systemConfigs.dashboard_managements];
	await Promise.all(
		managements.map((management, index) => {
			const MainModel = require(__path_schemas + management.collection);
			return MainModel.countDocuments({}).then(count => {management.count = count});
		})
	);

	res.locals.sidebarActive = `dashboard|list`;;
	res.render('backend/pages/dashboard', { 
		pageTitle: 'Dashboard',
		managements,
	});
});

module.exports = router;
