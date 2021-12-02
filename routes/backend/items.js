const express = require('express');
const router = express.Router();

const collectionName = 'items';
const MainModel = require(__path_models + collectionName);
const UtilsHelpers = require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const NotifyHelpers = require(__path_helpers + 'notify');
const systemConfigs = require(__path_configs + 'system');

const folderView = `${__path_views_admin}pages/${collectionName}`;
const linkIndex = `/${systemConfigs.prefixAdmin}/${collectionName}`;


/* POST Delete multi */
router.post('/change-ordering', async (req, res) => {
	const id		    = ParamsHelpers.getParam(req.body, 'cid', '');
	const ordering		= ParamsHelpers.getParam(req.body, 'ordering', '');
	const task 			= Array.isArray(id) ? 'change-ordering-multi' : 'change-ordering-one';

	await MainModel.changeOrdering(id, ordering, {task});
	NotifyHelpers.showNotifyAndRedirect(req, res, linkIndex, {task: 'change-ordering'});
});

/* GET Delete one */
router.get('/delete/:id', async (req, res) => {
	const id		    = ParamsHelpers.getParam(req.params, 'id', '');

	await MainModel.deleteItem(id, {task: 'delete-one'});
	NotifyHelpers.showNotifyAndRedirect(req, res, linkIndex, {task: 'delete-one'});
});

/* POST Delete multi */
router.post('/delete/', async (req, res) => {
	const id		    = ParamsHelpers.getParam(req.body, 'cid', '');

	const result = await MainModel.deleteItem(id, {task: 'delete-multi'});
	NotifyHelpers.showNotifyAndRedirect(req, res, linkIndex, {task: 'delete-multi', total: result.deletedCount});
});

/* GET Change status one */
router.get('/change-status/:status/:id', async (req, res) => {
	const currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
	const id		    = ParamsHelpers.getParam(req.params, 'id', '');

	await MainModel.changeStatus(id, currentStatus, {task: 'change-status-one'});
	NotifyHelpers.showNotifyAndRedirect(req, res, linkIndex, {task: 'change-status-one'});
});

/* POST Change status multi */
router.post('/change-status/:status', async (req, res) => {
	const currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
	const id		    = ParamsHelpers.getParam(req.body, 'cid', '');

	const result = await MainModel.changeStatus(id, currentStatus, {task: 'change-status-multi'});
	NotifyHelpers.showNotifyAndRedirect(req, res, linkIndex, {task: 'change-status-multi', total: result.modifiedCount});
});

/* GET list page. */
router.get('(/status/:status)?', async (req, res, next) => {
	const condition = {};
	const messages	= req.flash('notify');
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
		messages,
		items,
		currentStatus,
		filterStatus,
		search_value,
		pagination,
	});
});

// Get FORM --- ADD/EDIT
router.get('/form(/:id)?', async (req, res) => {
	
	res.render(`${folderView}/form`, {pageTitle: 'Items',});
});

// POST ADD/EDIT
router.post('/form', async (req, res) => {
	const item = req.body;

	await MainModel.saveItem(item, {task: 'add'});
	res.redirect(linkIndex);
});

module.exports = router;
