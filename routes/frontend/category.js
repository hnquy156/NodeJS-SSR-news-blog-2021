const express = require('express');
const router = express.Router();

const collectionName = 'category';
const ArticlesModel = require(__path_models + 'articles');
const folderView = `${__path_views_frontend}pages/${collectionName}`;
const layout = __path_views_frontend + 'layouts/layout';


/* GET category page. */
router.get('/', async (req, res, next) => {
	const newArticles = await ArticlesModel.getListFrontend({});
	res.render(`${folderView}/index`, { 
		pageTitle: 'Category', 
		layout, 
		newArticles,
	});
});

module.exports = router;