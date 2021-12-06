const express = require('express');
const router = express.Router();

const collectionName = 'category';
const ArticlesModel = require(__path_models + 'articles');
const folderView = `${__path_views_frontend}pages/${collectionName}`;
const layout = __path_views_frontend + 'layouts/layout';
const pageTitle = 'Category';

/* GET category page. */
router.get('/:category', async (req, res, next) => {
	const categorySlug = req.params.category;
	const categoryArticles = await ArticlesModel.getListFrontend({task: 'articles-in-category'}, {slug: categorySlug})
	
	res.render(`${folderView}/index`, { 
		pageTitle, 
		layout, 
		categoryArticles,
	});
});

module.exports = router;