/**
 * Will scan server_scripts/routes/ directory for all controller files and load their routers into a central router
 * Central router is then exposed by module.exports
 */

"use strict";

var fs      = require('fs');
var express = require('express');

var centralRouter = express.Router();

// Load all files in server_scripts/routes directory that export a router instance
// This excludes this file though (index.js)
var ROUTER_SCRIPTS = fs.readdirSync(__dirname)
	.filter(function (filename) { // exclude this index.js file
		return filename !== 'index.js'
	})
	.map(function (filename) { // require the controller module in
		return './' + filename;
	});

// Load all the routers pointed to in ROUTER_SCRIPTS
ROUTER_SCRIPTS.map(require).forEach(function (router) {
	centralRouter.use(router);
});

// attatch them to the centralRouter above
module.exports = centralRouter;
