/***********************************************
 * GETTERS
 * Helper methods for retrieving linked objects
 **********************************************/

var _     = require('lodash');
var async = require('async');

var dbService = require('../db');
var generateUniqueID = require('../generateUniqueID');

function getObjectID(object, idField) {
	console.log("in get object id")
	console.log(object, " : ", _.isString(object))
	if (_.isString(object)) {
		// Probably given the Object ID itself here, just return the object
		return object;
	} else if (_.isObject(object) && _.has(object, idField)) {
		return _.get(object, idField);
	} else {
		return null;
		// throw new Error('Invalid Arguments to getObjectID()');
	}
}

exports.getObjectID = getObjectID;

// Given a cloudant DB isntance, and a list of object IDs within that DB, returns
// a list of all the entries corresponding to the given IDs
// Eventually, use this for bulk read: https://docs.cloudant.com/database.html#get-documents
function getAllByID(db, ids, cb) {
  // Does a bulk get request...one request gets all of the documents given by their ids
  dbService.bulkFetchFunction(db,ids, (err, body) => {
    if (err) {
		console.log(err)
      cb(err);
    } else {
		console.log(db,' bulkFetchFunction results ', ids)
		console.log(body)
		var documents = body.flatMap(item => item.docs);
		documents = documents.map(item => item.ok);
    //   var documents = _.map(body, 'doc');
	  
      cb(null, documents);
    }
  });
}

// Expose this helper method
exports.getAllByID = getAllByID;

// given an order id, returns the order with the wheelchair fields populated
function getOrderByID(orderID, cb) {
	dbService.findDBfunction('orders',orderID, function (err, order) {
		if (err) {
			return cb(err);
		}
		order = order
		console.log('getOrderByID')
		console.log(order)
		// get the 'wheelchairs' field
		var getOrderChairs = function (cb) {
			console.log('getOrderChairs')
			var wheelchairs = order.wheelchairs || [];
			console.log(wheelchairs)
			var wheelchairIDs = wheelchairs.map(chair => {
				try{
					return getObjectID(chair, '_id')
				}
				catch{
					console.log('skip')
				}
			});
			getAllByID('design', wheelchairIDs, function (err, designs) {
				if (err) {
					return cb(err);
				}	
				cb(null, designs); // return the designs
			});
		};

		var getOrderDiscounts = function (cb) {
			var discounts = order.discounts || [];
			var discountIDs = discounts.map(discount => getObjectID(discount, '_id'));
			getAllByID('discounts', discountIDs, function (err, discounts) {
				if (err) {
					return cb(err);
				}

				cb(null, discounts);
			})
		};

		async.parallel({
			'wheelchairs': getOrderChairs,
			'discounts': getOrderDiscounts
		}, function (err, results) {
			if (err) {
				return cb(err);
			}
			order.wheelchairs = results.wheelchairs;
			order.discounts = results.discounts;

			cb(null, order); // return the order via the callback
		});
	});
};

exports.getOrderByID = getOrderByID;

// Gets a user object with all linked fields populated: 'cart', 'savedDesigns', 'orders'
function getUserByID(userID, cb) {
	// console.log('getUserByID in getters')
	dbService.findDBfunction('users', userID, function (err, user) {
	// dbService.users.get(userID, function (err, user) {
		if (err) {
			console.log(err)
			return cb(err);
		}

		// Get the cart for the current user
		var getUserCart = function (cb) {
			console.log('getUsserCart')
			console.log(user.cart)
			if (user.cart) {
				try {
					var cartID = getObjectID(user.cart, '_id');
					console.log("here: ", cartID)
					getOrderByID(cartID, cb); // get the cart along with all linked fields populated
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
				if (design) return getObjectID(design, '_id');
			});
			// console.log('saved design')
			getAllByID('design', savedDesignIDs, cb);
		};


		// Get the order history of the current user
		var getUserOrders = function (cb) {
			var userOrders = user.orders || [];
			// console.log('userOrders: ',userOrders)
			var orderIDS = userOrders.map(function (order) {
				if (order) return getObjectID(order, '_id');
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

/**
 * Given a array of discounts (either discount Objects or just discount ID strings),
 * tells you whether its okay to have all these discounts applied to a single order
 *
 * Reasons that this can return false:
 * - At least one of the discounts is not a multi-discount even though there's more than one discount that is being applied to the order
 * - A discount isn't included twice
 * - At least one of the discounts are expired
 */
function areValidOrderDiscounts(discounts, cb) {
	discounts = _.isArray(discounts) ? discounts : [];
	var discountIDs = discounts.map(discount => getObjectID(discount, '_id'));

	// Check that no discount is being added twice
	if (_.uniq(discountIDs).length !== discounts.length) {
		process.nextTick(() => cb(false));
		return;
	}
	getAllByID('discounts', discountIDs, function (err, discounts) {
		if (err) {
			return cb(false);
		}

		// Check that you're not mixing multi-discounts with non-multi-discounts
		if (!(_.every(discounts, 'isMultiDiscount')) && discounts.length > 1) {
			return cb(false);
		}

		// check that none of the discounts are expired
		var currDate = new Date();
		var noneExpired = discounts.every(discount => {
			var startDate = _.isDate(discount.startDate) ? discount.startDate : new Date(discount.startDate);
			var endDate = _.isDate(discount.endDate) ? discount.endDate : new Date(discount.endDate);
			return currDate >= startDate && currDate < endDate;
		});

		cb(noneExpired);
	});
}

exports.areValidOrderDiscounts = areValidOrderDiscounts;
