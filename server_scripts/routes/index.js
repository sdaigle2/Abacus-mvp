"use strict";

var fs      = require('fs');
var express = require('express');

var mainRouter = express.Router();

// Load all files in server_routes directory that export a router instance
// This excludes this file though (index.js)
var ROUTER_SCRIPTS = fs.readdirSync(__dirname)
	.filter(function (filename) { // exclude ths index.js file
		return filename !== 'index.js'
	})
	.map(function (filename) { // require the controller module in
		return './' + filename;
	});

// Load all the routers pointed to in ROUTER_SCRIPTS
ROUTER_SCRIPTS.map(require).forEach(function (router) {
	mainRouter.use(router);
});

// attatch them to the mainRouter above
module.exports = mainRouter;