const express = require('express');
const router = express.Router();

const collectionName = 'home'
const folderView = `${__path_views_frontend}pages/${collectionName}`;
const layout = __path_views_frontend + 'layouts/layout'
/* GET home page. */
router.get('/', function (req, res, next) {
	res.render(`${folderView}/index`, { pageTitle: 'Home', layout, });
});

module.exports = router;