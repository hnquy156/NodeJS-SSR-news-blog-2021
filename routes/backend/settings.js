const express = require('express');
const router = express.Router();

const collectionName = 'settings';
const MainModel = require(__path_models + collectionName);
const systemConfigs = require(__path_configs + 'system');

const folderView = `${__path_views_admin}pages/${collectionName}`;
const linkIndex = `/${systemConfigs.prefixAdmin}/${collectionName}`;
const pageTitle = "Settings";

// Get FORM --- ADD/EDIT
router.get('/', async (req, res) => {
	const messages	= req.flash('notify');
	let emptyItem = {id: '', linkedin: '', twitter: '', google: '', facebook: '', email: '', address: ''};
	res.locals.sidebarActive = `${collectionName}|form`;
	let item = await MainModel.getItem();
	item = item ? item : emptyItem;

	res.render(`${folderView}/form`, {pageTitle, item, messages});
});

// POST ADD/EDIT
router.post('/', async (req, res) => {
	const item = req.body;
	const task = item.id ? 'edit' : 'add';
	await MainModel.saveItem(item, {task});
	req.flash('notify', `success|Đã lưu cài đặt`);
	res.redirect(linkIndex);
});

module.exports = router;
