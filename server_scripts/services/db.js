/**
 * Exposes all necessary variables needed to interact with Cloudant DB
 */
"use strict";

//Cloudant Database API
var cloudant = require('cloudant')({account: process.env.CLOUDANT_USERNAME, password: process.env.CLOUDANT_PASSWORD});
var users = cloudant.use('users');
var orders = cloudant.use('orders');
var design = cloudant.use('design');

// Expose logged in cloudant instance along with DB models
module.exports = {
	cloudant: cloudant,
	users: users,
	orders: orders,
	design: design
};