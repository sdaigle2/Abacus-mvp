/*
 * This controller allows you to retrieve discounts from the DB given a discount ID
 */

const router = require('express').Router();
const dbService = require('../services/db');
const _ = require('lodash');
const restrict = require('../policies/restrict');

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

router.post('/discounts', restrict, function (req, res) {
	var discount = req.body;
	discount.createdBy = req.session.user;
	
	dbService.discounts.get(discount.id, function(err) {
		if (err) {
			dbService.discounts.insert(discount, discount.id, function (err, body, header) {
		        if (err) {
		          res.status(400);
		          res.json({err: 'Couldn\'t save design data into databse'});
		        } else {
		          res.json(body);
		        }
	      	});
		} else {
			res.status(400);
			res.json({msg: `Discount code "${discount.id}" already exists`});
		}
	});

	
});

module.exports = router;
