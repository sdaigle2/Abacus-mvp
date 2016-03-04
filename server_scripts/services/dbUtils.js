/**
 * Provides various helper methods for retrieving Objects with linked fields
 */

var _     = require('lodash');
var async = require('async');

var dbService = require('../services/db');

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
		getAllByID(dbService.design, order.wheelchairs || [], function (err, designs) {
			if (err) {
				return cb(err);
			}

			// Set the wheelchairs field to be the actual designs objects instead of just the design IDs
			order.wheelchairs = designs;

			cb(null, orders); // return the designs
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
				dbService.orders.get(user.cart, cb);
			} else {
				cb(null, null); // if user doesnt have a cart yet, just resolve it to be null
			}
		};

		// Get the savedDesigns for the current user
		var getUserSavedDesigns = function (cb) {
			getAllByID(dbService.design, user.savedDesigns || [], cb);
		};

		// Get the order history of the current user
		var getUserOrders = function (cb) {
			getAllByID(dbService.orders, user.orders || [], cb);
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