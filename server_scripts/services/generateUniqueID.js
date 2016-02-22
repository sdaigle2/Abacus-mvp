/**
 * Given a cloudant DB, generates a unique, human readable ID.
 * This is done by generating random short IDs and checking in the DB whether that ID exists.
 * If a id which doesnt currently exist in the DB is generated, that ID is returned via the callback
 */

var shortid = require('shortid');

function generateUniqueID(db, cb) {
	var candidateID = shortid.generate(); // generate a short, human friendly id

	db.get(candidateID, function (err, record) {
		// If the record wasnt found, then we know this is a valid unique ID
		if (err) {
			if (err.statusCode === 404) {
				cb(null, candidateID);
			} else { // something else has gone wrong...
				cb(err);
			}
		} else {
			// try to generate another ID...this is tail recursion so wont lead to stack overflow even in worst case
			generateUniqueID(db, cb);	
		}
	});
}

module.exports = generateUniqueID;