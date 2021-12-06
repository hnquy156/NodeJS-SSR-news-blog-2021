const express = require('express');
const router = express.Router();

const collectionName = 'contact';
const ArticlesModel = require(__path_models + 'articles');
const CategoriesModel = require(__path_models + 'categories');
const folderView = `${__path_views_frontend}pages/${collectionName}`;
const layout = __path_views_frontend + 'layouts/layout';
const pageTitle = 'Contact Us';

/* GET contact page. */
router.get('/', async (req, res, next) => {

	res.render(`${folderView}/index`, { 
		pageTitle, 
		layout,
	});
});

/* GET contact sent page. */
router.get('/success', async (req, res, next) => {

	res.render(`${folderView}/success`, { 
		pageTitle, 
		layout,
	});
});

module.exports = router;