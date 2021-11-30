const express = require('express');
const router = express.Router();

const collectionName = 'items';
const MainModel = require(__path_models + collectionName);
const UtilsHelpers = require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');

const folderView = `${__path_views_admin}pages/${collectionName}`;

/* GET list page. */
router.get('/', async (req, res, next) => {
	const condition = {};
	const currentStatus = ParamsHelpers.getParam(req.query, 'status', 'all');
	const filterStatus = await UtilsHelpers.createFilterStatus(currentStatus, collectionName);

	if (currentStatus !== 'all') condition.status = currentStatus;
	const items = await MainModel.getList(condition);

	res.render(`${folderView}/list`, { 
		pageTitle: 'Items',
		items,
		currentStatus,
		filterStatus,
	});
});


module.exports = router;
