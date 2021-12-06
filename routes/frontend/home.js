const express = require('express');
const router = express.Router();

const collectionName = 'home';
const ArticlesModel = require(__path_models + 'articles');
const CategoriesModel = require(__path_models + 'categories');
const folderView = `${__path_views_frontend}pages/${collectionName}`;
const layout = __path_views_frontend + 'layouts/layout';
const pageTitle = 'Home';

/* GET home page. */
router.get('/', async (req, res, next) => {
	const newArticles = await ArticlesModel.getListFrontend({task: 'articles-new'});
	const filteredArticles = [...newArticles].sort((a,b) => {
		if (a.group.name > b.group.name) return 1
		else if (a.group.name < b.group.name) return -1
		else if (a.group.time > b.group.time) return -1
		else return 1;
	});
	const specialArticles = await ArticlesModel.getListFrontend({task: 'articles-special'});
	const randomArticles = await ArticlesModel.getListFrontend({task: 'articles-random'});
	const categoriesList = await CategoriesModel.getListFrontend({task: 'categories-list'});

	res.render(`${folderView}/index`, { 
		pageTitle, 
		layout, 
		newArticles,
		specialArticles,
		randomArticles,
		categoriesList,
		filteredArticles,
	});
});

module.exports = router;