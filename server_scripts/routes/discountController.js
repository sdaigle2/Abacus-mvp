/*
 * This controller allows you to retrieve discounts from the DB given a discount ID
 */

const router = require('express').Router();
const dbService = require('../services/db');

router.get('/discounts/:id', function (req, res) {
	var id = req.params.id;
	//query the database
	dbService.discounts.get(id,function(err,body){
		if (err) {
			res.status(404);
			res.json({
				msg: 'Did not find the matching discount, please try again',
				err: err
			});
		} else {
			res.json(body); //load the design if id is correct
		}
	});
});

module.exports = router;