/**
 * Exposes all necessary variables needed to interact with Cloudant DB
 */
"use strict";

var _  = require('lodash');
//Cloudant Database API
var cloudant = require('cloudant')({account: process.env.CLOUDANT_USERNAME, password: process.env.CLOUDANT_PASSWORD});

var users     = cloudant.use('users');
var orders    = cloudant.use('orders');
var design    = cloudant.use('design');
var discounts = cloudant.use('discounts');

// This will make sure that nobody accidently writes code that inserts discounts into
// cloudant. If you try calling discounts.insert(...), you will only get an error
discounts.insert = (entry, id, cb) => {
	if (_.isFunction(id)) {
		cb = id;
	}

	cb(new Error('Cannot Insert Discounts from Backend. Must insert manually from Cloudant Website.'));
};

// Expose logged in cloudant instance along with DB models
module.exports = {
	cloudant: cloudant,
	users: users,
	orders: orders,
	designs: design,
	discounts: discounts
};