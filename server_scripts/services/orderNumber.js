/**
 * The Order Number is stored in a DB of its own in Cloudant
 * This DB is called 'order_number' and it contains one document with the ID 'MAIN'
 * This document has a 'number' field which starts as 1000 and can be incremented with the functions in this file
 *
 * This function also keeps a local copy of the order number
 * This is used to keep track of what the current order number is and should be consistent with what is in the DB
 *
 * The increment function here is a central point of congestion.
 * That is, any calls to the function will have to wait till any previous calls to it are resolved
 * It was designed this way so that we can keep consistency between the local copy of the MAIN doc & the copy that exists in the Cloudant DB
 *
 * Also, make sure to NOT turn of the caching feature of the require() method, that is crucial to the behaviour of this script
 */

var _     = require('lodash');
var async = require('async');

var dbService = require('./db');

// The ID for the 'order_number' document that contains our order number
const ORDER_NUMBER_DOC_ID = 'MAIN';

// This is a local copy of the order number....true value exists in DB but this value should be consistent with that
const LOCAL_MAIN_DOC = { // default values
	'_id': ORDER_NUMBER_DOC_ID,
	'_rev': null,
	'number': 1000
};

// Gets the MAIN doc from cloudant, assigns it to the LOCAL_MAIN_DOC variable here
function synchronizeLocalMainDoc(cb) {
	dbService.orderNumber.get(ORDER_NUMBER_DOC_ID, (err, body) => {
		if (err) {
			cb(err);
		} else {
			if (_.isNumber(_.get(body, 'number'))) {
				_.assign(LOCAL_MAIN_DOC, body);
				cb(null, body);
			} else {
				var errMsg = `RESTART SERVER: MAIN DOCUMENT FOR ORDER NUMBERS TABLE DOESNT HAVE A PROPER NUMBER VALUE`;
				cb(new Error(errMsg));
				console.log(errMsg);
			}
		}
	});
}

// Make a request to the DB .... none of the increment requests will be handled until orderNumInitPromise is resolved
const orderNumInitPromise = new Promise((resolve, reject) => {
	synchronizeLocalMainDoc((err) => {
		if (err) {
			reject(err);
		} else {
			resolve(LOCAL_MAIN_DOC);
		}
	});
});

// Expose this promise, server.js can wait on it before starting the server
exports.initPromise = orderNumInitPromise;

/**
 * Will increment the main order number document and
 * attach the most up to date order number to numberHolder
 */
function incrementOrderNumber(numberHolder, cb) {
	numberHolder = numberHolder || {};
	LOCAL_MAIN_DOC.number++;
	dbService.orderNumber.insert(LOCAL_MAIN_DOC, ORDER_NUMBER_DOC_ID, function (err, res) {
		if (err) {
			cb(err);
		} else {
			LOCAL_MAIN_DOC._rev = res.rev;
			numberHolder.number = LOCAL_MAIN_DOC.number;
			cb();
		}
	});
}

// create worker queue that will only allow one increment task to run at a time
const incrementQueue = async.queue(function (opts, cb) {
	incrementOrderNumber(opts, err => {
		if (err) {
			// If you couldnt increment, most likely because there was a document update conflict...
			// Try synchronizing first then try again
			synchronizeLocalMainDoc(err => {
				if (err) { // if there was an error in synchronizing, just give up, dont want to keep retrying
					cb(err);
				} else {
					incrementOrderNumber(opts, cb); // LOCAL_MAIN_DOC is now synchronized, now should be able to update
				};
			});
		} else {
			cb(); // increment worked!
		}
	});
}, 1);

// Will do an atomic increment....this will only work if we have one instance of our web server running
exports.increment = () => {
	return orderNumInitPromise // wait on the initpromise first
	.then(() => {
		return new Promise((resolve, reject) => {
			var numberHolder = {};
			incrementQueue.push(numberHolder, err => {
				if (err) {
					reject(err);
				} else {
					resolve(numberHolder.number);
				}
			});
		});
	});
};
