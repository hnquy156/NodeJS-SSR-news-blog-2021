const express = require('express');
const router = express.Router();

const MainModel = require(__path_models + 'items');

const collectionName = 'items';
const folderView = `${__path_views_admin}pages/${collectionName}`;

/* GET home page. */
router.get('/', async (req, res, next) => {
	const items = await MainModel.getList();
	res.render(`${folderView}/list`, { 
		pageTitle: 'Items',
		items,
	});
});


module.exports = router;
