const express = require('express');
const router = express.Router();

const collectionName = 'auth';
const ArticlesModel = require(__path_models + 'articles');
const CategoriesModel = require(__path_models + 'categories');
const folderView = `${__path_views_frontend}pages/${collectionName}`;
const layout = __path_views_frontend + 'layouts/layout';
const pageTitle = 'Login';

/* GET home page. */
router.get('/login', async (req, res, next) => {

	res.render(`${folderView}/login`, { 
		pageTitle, 
		layout: false,
	});
});

module.exports = router;