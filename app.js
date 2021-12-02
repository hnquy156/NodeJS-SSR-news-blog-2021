const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');

const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session')

const pathConfigs = require('./path');
// Define path
global.__path_base = __dirname + '/';
global.__path_app = __path_base;
global.__path_views = __path_base + pathConfigs.folderViews + '/';
global.__path_views_admin = __path_views + pathConfigs.folderViewsAdmin + '/';
global.__path_views_frontend = __path_views + pathConfigs.folderViewsFrontend + '/';
global.__path_configs = __path_base + pathConfigs.folderConfig + '/';
global.__path_routes = __path_base + pathConfigs.folderRoutes + '/';
global.__path_public = __path_base + pathConfigs.folderPublic + '/';
global.__path_schemas = __path_base + pathConfigs.folderSchemas + '/';
global.__path_models = __path_base + pathConfigs.folderModels + '/';
global.__path_helpers = __path_base + pathConfigs.folderHelpers + '/';
global.__path_validates = __path_base + pathConfigs.folderValidates + '/';

const systemConfigs = require(__path_configs + 'system');
const databaseConfigs = require(__path_configs + 'database');

// connect express
const app = express();

// Connect MongoDB
mongoose.connect(`mongodb+srv://${databaseConfigs.username}:${databaseConfigs.password}@cluster0.ucjug.mongodb.net/${databaseConfigs.database}?retryWrites=true&w=majority`);


// view engine setup
app.set('views', __path_views);
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', __path_views_admin + 'layouts/layout');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__path_public));
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false,
	cookie: { 
		secure: false ,
		maxAge: 1000*60*5,
	}
}))

// Use flash connect
app.use(flash());
// Local variable
app.locals.systemConfigs = systemConfigs;
// app.locals.moment = moment;

// Setup Router
app.use(`/${systemConfigs.prefixAdmin}`, require(__path_routes + 'backend/index'));
app.use(`/`, require(__path_routes + 'backend/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { pageTitle: 'Error'});
});

module.exports = app;
