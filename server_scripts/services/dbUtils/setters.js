/********************************************
 * SETTERS
 * Helper methods for updating linked objects
 *******************************************/

var _     = require('lodash');
var async = require('async');

var dbService = require('../db');
var generateUniqueID = require('../generateUniqueID');

 /**
 * Given a list of DB entries, updates their records in the DB
 * If a given entry is new (inferred by absence of an ID field), then a new entry is created for it
 * If a given entry is just a string or number, its inferred to be a ID, and
 * no update is done and the value for the entry is retrieved
 * Returns list of all entry values
 * 
 * argsObj = {
 *	 db: <db instance from cloudant module>,
 *	 dbInsert: <(optional) custom insert method, defaults to db.insert>,
 *	 idField: <string representing name for idField>
 *	 entries: <list of entries to update>
 * }
 */
function updateOrInsertAllEntries(argsObj, cb) {
	var db = argsObj.db;
	var dbInsert = argsObj.dbInsert || db.insert; // in special cases (like Designs) can specify another insert function
	var idField = argsObj.idField;
	var entries = argsObj.entries;
	async.map(entries, function (entry, cb) {
		if (_.isObject(entry)) {
			// We're being given the object as a whole
			// Check if it has the id field...if it doesn't then create an entry for it
			if (entry[idField]) {
				var entryID = entry[idField];
				// update the entry
				dbInsert(entry, entryID, function (err, res) {
					if (err) {
						cb(err);
					} else {
						cb(null, entry); // updated the entry succesfully...return the entry value 
					}
				});
			} else {
				// No ID field present, must be a new object so create an entry for it
				dbInsert(entry, function (err, body) {
					if (err) {
						cb(err);
					} else {
						cb(null, entry); // created the entry succesfully...return the entry value
					}
				});
			}
		} else if (_.isString(entry) || _.isNumber(entry)) {
			// We're being given the ID for an object
			var entryID = entry;
			db.get(entryID, function (err, entryValue) {
				if (err) {
					cb(err);
				} else {
					cb(null, entryValue); // read the entry succesfully...return the entry value
				}
			});
		} else {
			cb(new Error("Bad Entry Value:\n" + JSON.stringify(entry, null, 2)));
		}
	}, cb);
}

// Expose updateOrInsertAllEntries function
exports.updateOrInsertAllEntries = updateOrInsertAllEntries;

// Method to insert a Design instance into the DB
// Design insertion is a special case because if you want to create a new entry,
// The ID for it must be generated by an external generateUniqueID function
function insertDesign(designValue, id, cb) {
	if (_.isFunction(id)) {
		// No ID given, so must create a new entry for the given design
		cb = id;
		id = null;
		generateUniqueID(dbService.designs, function (err, generatedID) {
			if (err) {
				cb(err);
			} else {
				dbService.designs.insert(designValue, generatedID, cb);
			}
		});
	} else {
		// An ID is specified, so update the design with that given ID
		dbService.designs.insert(designValue, id, cb);
	}
}

exports.insertDesign = insertDesign;

// Updates all linked Order fields: wheelchairs
function updateOrderLinkedFields(orderObj, cb) {
	var wheelchairs = orderObj.wheelchairs || [];

	updateOrInsertAllEntries({
		db: dbService.designs,
		dbInsert: insertDesign,
		idField: '_id',
		entries: wheelchairs
	}, function (err, wheelchairs) {
		if (err) {
			cb(err);
		} else {
			orderObj.wheelchairs = _.map(wheelchairs, '_id');
			cb(null, orderObj);
		}
	});
}

exports.updateOrderLinkedFields = updateOrderLinkedFields;

function insertOrder(order, id, cb) {
	if (_.isFunction(id)) {
		// No ID is given, must create a new order entry
		cb = id;
		id = null;

		updateOrderLinkedFields(order, function (err, updatedOrder) {
			if (err) {
				cb(err);
			} else {
				dbService.insert(updatedOrder, cb);
			}
		});
	} else {
		// ID was given, update corresponding record after updating linked records
		updateOrderLinkedFields(order, function (err, updatedOrder) {
			if (err) {
				cb(err);
			} else {
				dbService.insert(updatedOrder, id, cb); // update the order with the given id
			}
		});
	}
}

exports.insertOrder = insertOrder;

// Updates all linked User fields: orders, savedDesigns, & cart
function updateLinkedUserFields(userObj, cb) {
	var updateOrders = function (cb) {
		var orders = userObj.orders || [];
		updateOrInsertAllEntries({
			db: dbService.order,
			dbInsert: insertOrder,
			idField: '_id',
			entries: orders
		}, cb);
	};

	var updateSavedDesigns = function (cb) {
		var savedDesigns = userObj.savedDesigns || [];
		updateOrInsertAllEntries({
			db: dbService.designs,
			dbInsert: insertDesign,
			idField: '_id',
			entries: savedDesigns
		}, cb);
	};

	var updateCart = function (cb) {
		var cart = userObj.cart;

		if (_.isString(cart)) {
			// it's just the cart's order id, get the order and return it
			dbService.order.get(cart, cb);
		} else if (_.isNull(cart)) {
			// User doesnt have a cart order yet...just return null for it then
			process.nextTick(function () {
				cb(null, null);
			});
		} else if (_.isObject(cart)) {
			updateOrderLinkedFields(cart, cb);
		} else {
			cb(new Error("Bad Cart Value:\n" + JSON.stringify(cart, null, 2)));
		}
	};

	// Execute all these updates in parallel
	async.parallel({
		'orders': updateOrders,
		'savedDesigns': updateSavedDesigns,
		'cart': updateCart
	}, function (err, results) {
		if (err) {
			cb(err);
		} else {
			userObj.orders = _.map(results.orders, '_id');
			userObj.savedDesigns = _.map(results.savedDesigns, '_id');
			userObj.cart = _.isNull(results.cart) ? null : results.cart._id; // when a user doesnt have a cart, its null. Must check

			cb(null, userObj);
		}
	});
}

exports.updateLinkedUserFields = updateLinkedUserFields;

