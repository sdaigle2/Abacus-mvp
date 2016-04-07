/**
 * Endpoints for sending PDF invoices and making orders
 */
"use strict";

var router = require('express').Router();
var _      = require('lodash');
var async  = require('async');

// Import services
var verifyOrder        = require('../services/data').verifyOrder;
var verifyChair        = require('../services/data').verifyWheelchair;
var genInvoice         = require('../services/pdfGen').generateInvoice;
var genSave            = require('../services/pdfGen').generateSave;
var generateInvoicePDF = require('../services/generateInvoicePDF');
var stripe             = require('../services/stripe');
var sendgrid           = require('../services/sendgrid');
var dbService          = require('../services/db');
var orderNumber        = require('../services/orderNumber');
//Send a pdf of the given wheelchair to the user
router.post('/save', function (req, res) {
  //Cross check the wheelchair against the JSON, while calculating the total price
  var total = verifyChair(req.body.wheelchair);
  //The wheelchair is valid
  if (total !== false) {
    //Generate a pdf and send it as a blob
    genSave(req.body.wheelchair, res);
  }
  else  //There was an invalid value in the wheelchair object
    res.send('Invalid chair');
});

//Save order to the db, create a stripe payment, and email pdf to the user
router.post('/order', function (req, res) {
  delete req.body.order.orderNum;
  console.log(req.body);

  //This token was created client side by the Stripe API, so we do not need credit card details as part of the request
  var stripeToken = req.body.token;
  console.log(stripeToken);
  var order = req.body.order;

  //Cross check all wheelchairs in the order against the JSON, while calculating the total price
  var total = req.body.totalPrice;
  //The order is valid
  if (total !== false) {

    var order = req.body.order;

    // returns error value with a charge object ... if payMethod isnt 'Credit Card', just returns {} for charges object
    const createStripeCharge = cb => {
      if (order.payMethod === 'Credit Card') {
        //Create a new stripe payment
        var charge = stripe.charges.create({
          amount: Math.round(total * 30), // Amount in cents
          currency: "usd",
          source: stripeToken,
          description: "Tinker order"
        }, cb);
      } else {
        cb(null, {});
      }
    };

    // returns true/false depending on whether the discounts were valid
    const validateOrderDiscounts = cb => {
      dbUtils.areValidOrderDiscounts(order.discounts, cb);
    };

    // returns error value with user object (empty user object if user wasnt logged in)
    const updateUserOrderHistory = cb => {
      if (!_.get(req, 'session.user')) {
        return process.nextTick(() => cb(null, {}));
      }

      //Use session cookie to check if user is logged in
      dbService.users.get(req.session.user, function(err, user) {
        if (!err && _.isObject(user)) { // user was found ... make sure that this order is that users cart order
            var curOrderID = order.id || order._id;
            var userCartID = dbUtils.getObjectID(user.cart, '_id');
            var userOrders = _.isArray(user.orders) ? user.orders : [];

            if (curOrderID !== userCartID) {
              cb({status: 400, err: 'Given order was not the users cart order'});
            } else {
               // push the order to the users order history and set cart to null
               const userID = user._id || user.id;
               user.orders.push(order);
               user.cart = null;
               insertUser(user, userID, function (err, minUser) {
                if (err) {
                  return cb({status: 500, err: err});
                }
                cb(null, minUser);
               });
            }
        } else {
          // User wasnt logged in when they made the order
          cb(null, {});
        }
      });
    };

    // takes in boolean representing whether user is logged in & returns order object
    // Only inserts order if user isnt logged in
    const insertOrder = (isLoggedIn, cb) => {
      if (!isLoggedIn) {
        dbUtils.insertOrder(order, cb);
      } else {
        cb(null, order);
      }
    };

    // returns error value with object {orderNumber: <Order Number>}
    const sendInvoiceEmails = cb => {

      orderNum.increment() // this is an atomic operation & a central point of congestion...could take a while
      .then(curOrderNum => {
        order.orderNum = curOrderNum;

        //Set up the invoice email
        var invoiceEmail = new sendgrid.Email({
          from: 'do-not-reply@tinker.fit',
          subject: 'Per4max Purchase Invoice'
        });

        var manufactureCopy = new sendgrid.Email({
          from: 'do-not-reply@tinker.fit',
          subject: 'Per4max Purchase Invoice'
        });

        //Send email to the user containing the invoice as a pdf
        invoiceEmail.to = req.body.order.email;
        invoiceEmail.text = 'Thank you for using Tinker to purchase your new Wheelchair. We have attached the invoice for your order.';
        manufactureCopy.to = 'sales@intelliwheels.net';
        manufactureCopy.text = 'An order just been placed, here is a copy of the invoice';
        
        generateInvoicePDF(order, function (err, pdfPath) {
          if (err) {
            cb(err);
          } else {
            const sendInvoiceMail = function (cb) {
              invoiceEmail.addFile({
                path: pdfPath
              });
              sendgrid.send(invoiceEmail, function (err, json) {
                console.log(`Error while sending user invoice email:\n${JSON.stringify(err, null, 2)}`);
                cb(err);
              });
            };

            const sendManufacturerEmail = function (cb) {
              manufactureCopy.addFile({
                path: pdfPath
              });
              sendgrid.send(manufactureCopy, function (err, json) {
                console.log(`Error while sending manufacturer invoice email:\n${JSON.stringify(err, null, 2)}`);
                cb(err);
              });
            };

            // send the emails out in parallel
            async.parallel([sendInvoiceMail, sendManufacturerEmail], function (err) {
              if (err) {
                cb(err);
              } else {
                cb(null, {'orderNum': curOrderNum});
              }
            });


          }
        });

      })
      .catch(err => {
        cb(err);
      });

    };

    validateOrderDiscounts(valid => {
      if (!valid) {
        res.status(400);
        res.json({err: 'Order Discounts were invalid'});
        return;
      }
      createStripeCharge((err, charge) => {
        if (err) {
          console.log(err);
          res.status(400);
          res.json({err: 'Error while processing credit card payment'});
          return;
        }

        updateUserOrderHistory((err, user) => {
          if (err) {
            res.status(400);
            res.json({err: err});
            return;
          }

          const userIsLoggedIn = _.isObject(user) && _.isEmpty(user);
          insertOrder(userIsLoggedIn, (err) => {
            if (err) {
              res.status(500);
              res.json({err: err});
              return;
            }

            sendInvoiceEmails((err, orderNum) => {
              if (err) {
                res.status(500);
                res.json({err: err});
                return;
              }

              // Respond with 200 status and user & order number in the response body
              res.json({user: user, orderNum: orderNum});
            });
          });
        });
      });
    });    
  }
  else
    res.send({err: 'Invalid order'});
});

module.exports = router; // expose the router
