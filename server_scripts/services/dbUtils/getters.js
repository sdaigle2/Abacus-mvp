/***********************************************
 * GETTERS
 * Helper methods for retrieving linked objects
 **********************************************/

var _     = require('lodash');
var async = require('async');

var dbService = require('../db');
var generateUniqueID = require('../generateUniqueID');

function getObjectID(object, idField) {
	if (_.isString(object)) {
		// Probably given the Object ID itself here, just return the object
		return object;
	} else if (_.isObject(object) && _.has(object, idField)) {
		return _.get(object, idField);
	} else {
		throw new Error('Invalid Arguments to getObjectID()');
	}
}

exports.getObjectID = getObjectID;

// Given a cloudant DB isntance, and a list of object IDs within that DB, returns
// a list of all the entries corresponding to the given IDs
function getAllByID(db, ids, cb) {
	async.map(ids, db.get, cb); // async is a great npm module: https://www.npmjs.com/package/async
}

// Expose this helper method
exports.getAllByID = getAllByID;

// given an order id, returns the order with the wheelchair fields populated
function getOrderByID(orderID, cb) {
	dbService.orders.get(orderID, function (err, order) {
		if (err) {
			return cb(err);
		}

		// Populate the 'wheelchairs' field
		getAllByID(dbService.designs, order.wheelchairs || [], function (err, designs) {
			if (err) {
				return cb(err);
			}

			// Set the wheelchairs field to be the actual designs objects instead of just the design IDs
			order.wheelchairs = designs;

			cb(null, order); // return the order
		});
	});
};

exports.getOrderByID = getOrderByID;

// Gets a user object with all linked fields populated: 'cart', 'savedDesigns', 'orders'
function getUserByID(userID, cb) {
	dbService.users.get(userID, function (err, user) {
		if (err) {
			return cb(err);
		}

		// Get the cart for the current user
		var getUserCart = function (cb) {
			if (user.cart) {
				try {
					var cartID = getObjectID(user.cart, '_id');
					dbService.orders.get(cartID, cb);
				} catch (badCartValueErr) {
					// The given cart didn't have an ID field...this means the cart value is invalid and can be treated as null
					cb(null, null);	
				}
			} else {
				cb(null, null); // if user doesnt have a cart yet, just resolve it to be null
			}
		};

		// Get the savedDesigns for the current user
		var getUserSavedDesigns = function (cb) {
			var savedDesigns = user.savedDesigns || [];
			var savedDesignIDs = savedDesigns.map(function (design) {
				return getObjectID(design, '_id');
			});
			getAllByID(dbService.designs, savedDesignIDs, cb);
		};

		// Get the order history of the current user
		var getUserOrders = function (cb) {
			var userOrders = user.orders || [];
			var orderIDS = userOrders.map(function (order) {
				return getObjectID(order, '_id');	
			});
			// Gets all the orders with their linked fields populated. (Only linked field in Orders is 'wheelchairs' which are designs)
			async.map(orderIDS, getOrderByID, cb);
		};

		// Execute all these requests in parallel
		async.parallel({
			'cart': getUserCart,
			'savedDesigns': getUserSavedDesigns,
			'orders': getUserOrders
		}, function (err, results) {
			if (err) {
				return cb(err);
			}
			// Overwrite each of the fields with their populated counterparts in results
			user.cart         = results.cart;
			user.savedDesigns = results.savedDesigns;
			user.orders       = results.orders;

			cb(null, user);
		});
	});
}

exports.getUserByID = getUserByID;