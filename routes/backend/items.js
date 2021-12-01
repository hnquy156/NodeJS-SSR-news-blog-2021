const express = require('express');
const router = express.Router();

const collectionName = 'items';
const MainModel = require(__path_models + collectionName);
const UtilsHelpers = require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const systemConfigs = require(__path_configs + 'system');

const folderView = `${__path_views_admin}pages/${collectionName}`;
const linkIndex = `/${systemConfigs.prefixAdmin}/${collectionName}`;

/* Change status one */
router.get('/change-status/:status/:id', async (req, res) => {
	const currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
	const id		    = ParamsHelpers.getParam(req.params, 'id', '');

	await MainModel.changeStatus(id, currentStatus, null);
	res.redirect(linkIndex);
});

/* GET list page. */
router.get('(/status/:status)?', async (req, res, next) => {
	const condition = {};
	const currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
	const currentPage = ParamsHelpers.getParam(req.query, 'page', 1);
	const search_value = ParamsHelpers.getParam(req.query, 'search_value', '');
	const filterStatus = await UtilsHelpers.createFilterStatus(currentStatus, collectionName, search_value);

	if (currentStatus !== 'all') condition.status = currentStatus;
	if (search_value) condition.name = new RegExp(search_value, 'i');

	const pagination = {
		itemsTotal: await MainModel.countItems(condition),
		itemsOnPerPage: 3,
		currentPage,
		pageRanges : 5,
	}
	pagination.pagesTotal = Math.ceil(pagination.itemsTotal / pagination.itemsOnPerPage);
	const options = {
		limit: pagination.itemsOnPerPage,
		skip: (pagination.currentPage - 1) * pagination.itemsOnPerPage,
	}
	const items = await MainModel.getList(condition, options);

	res.render(`${folderView}/list`, { 
		pageTitle: 'Items',
		items,
		currentStatus,
		filterStatus,
		search_value,
		pagination,
	});
});

// Get FORM
// router.get('/form(/:id)?', async (req, res) => {
	
// 	res.render(`${folderView}/form`, {pageTitle: 'Items',})
// });


module.exports = router;
