/*
 * This controller allows you to retrieve, edit, delete discounts from the DB
 */
"use strict";

const router = require('express').Router();
const dbService = require('../services/db');
const _ = require('lodash');
const Promise = require('bluebird');
const restrict = require('../policies/restrict');
const getUserPr = Promise.promisify(dbService.users.get);

router.get('/discounts', restrict, function (req, res) {
	getUserPr(req.session.user)
	.then(function(user) {
		const userType = user.userType;
		if (userType !== 'admin' && userType !== 'superAdmin') {
			res.status(401);
			res.json({msg: 'Only admin users are authorized to perform this operation.'});
			return;
		}
		dbService.discounts.list({include_docs: true}, function(err, body){
			if (err) {
				res.status(500);
				res.json({err: 'Error while getting discounts'});
				return;
			}
			res.json(body);
		});
	})
	.catch(err => {
		res.status(404);
		res.json({err: err});
	});
});

router.post('/discounts/:discountId/expire', restrict, function (req, res) {
	const discountId = req.params.discountId;
	getUserPr(req.session.user)
	.then(function(user) {
		const userType = user.userType;
		if (userType !== 'admin' && userType !== 'superAdmin') {
			res.status(401);
			res.json({msg: 'Only admin users are authorized to perform this operation.'});
			return;
		}
		dbService.discounts.get(discountId, function(err, body) {
			if (!err) {
				let discount = body;
				let date = new Date();
				date.setDate(date.getDate() - 1); // set yesterday in order for the discount to be expired
				discount.endDate = date;
				dbService.discounts.insert(discount, discountId, function (err, body, header) {
					if (err) {
						res.status(500);
						res.json({err: 'Couldn\'t save discount into database'});
					} else {
						res.json(body);
					}
				});
			} else {
				res.status(404);
				res.json({msg: `Discount code "${discountId}" does not exist`});
			}
		});
	})
	.catch(err => {
		res.status(404);
		res.json({err: err});
	});
});

router.get('/discounts/:id', restrict, function (req, res) {
	dbService.discounts.get(req.params.id, function(err, body){
		if (err) {
			res.status(404);
			res.json({
				msg: 'Did not find the matching discount, please try again',
				err: err
			});
		} else {
			res.json(body);
		}
	});
});

router.put('/discounts/:id', restrict, function (req, res) {
	const discount = req.body;
	const discountId = discount._id;
	getUserPr(req.session.user)
	.then(function(user) {
		const userType = user.userType;
		if (userType !== 'admin' && userType !== 'superAdmin') {
			res.status(401);
			res.json({msg: 'Only admin users are authorized to perform this operation.'});
			return;
		}
		dbService.discounts.get(discountId, function(err) {
			if (!err) {
				delete discount.editDiscountPage;

				discount.percent = discount.percent / 100;

				dbService.discounts.insert(discount, discountId, function (err, body, header) {
					if (err) {
					  res.status(500);
					  res.json({err: 'Couldn\'t save discount into database'});
					} else {
					  res.json(body);
					}
				});
			} else {
				res.status(404);
				res.json({msg: `Discount code "${discountId}" does not exist`});
			}
		});
	})
	.catch(err => {
		res.status(404);
		res.json({err: err});
	});
});

router.post('/discounts', restrict, function (req, res) {
	var discount = req.body;
	discount.createdBy = req.session.user;
	getUserPr(discount.createdBy)
	.then(function(user) {
		const userType = user.userType;
		if (userType !== 'admin' && userType !== 'superAdmin') {
			res.status(401);
			res.json({msg: 'Only admin users are authorized to perform this operation.'});
			return;
		}
		dbService.discounts.get(discount.id, function(err) {
			if (err) {
				discount.createdAt = new Date();
				discount.percent = discount.percent / 100;
				dbService.discounts.insert(discount, discount.id, function (err, body, header) {
					if (err) {
					  res.status(500);
					  res.json({err: 'Couldn\'t save discount into database'});
					} else {
					  res.json(body);
					}
				});
			} else {
				res.status(404);
				res.json({msg: `Discount code "${discount.id}" already exists`});
			}
		});
	})
	.catch(err => {
		res.status(404);
		res.json({err: err});
	});
});

module.exports = router;
