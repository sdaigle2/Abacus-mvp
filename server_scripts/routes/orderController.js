/**
 * Endpoints for sending PDF invoices and making orders
 */
"use strict";

const router = require('express').Router();
const _      = require('lodash');
const async  = require('async');

// Import services
const generatePDF     = require('../services/generatePDF');
const priceCalculator = require('../services/priceCalculator');
const stripe          = require('../services/payment');
const paypal          = require('../services/paypal');
const sendgrid        = require('../services/sendgrid');
const dbService       = require('../services/db');
const orderNumber     = require('../services/orderNumber');
const dbUtils         = require('../services/dbUtils');

// Manufacturer Email to send invoices to
const MANUFACTURER_EMAIL = ['prozrachniy@gmail.com'];
//const MANUFACTURER_EMAIL = ['scott@intelliwheels.net', 'brian@intelliwheels.net'];
console.log(`NOTE: Invoice Emails will be sent to Manufacturer at this email: ${MANUFACTURER_EMAIL}`);

// downloads Invoice PDF for a given order
router.get('/orders/:id/invoice', (req, res) => {
  var id = req.params.id;

  if (!_.isString(id) || (id === '')) {
    res.status(400);
    return res.json({err: `Bad ID value given: ${id}`});
  }

  dbUtils.getOrderByID(id, (err, order) => {
    if (err) {
      res.status(400);
      return res.json(err);
    }
    generatePDF.forInvoice(order, true, (err, stream) => {
      if (err) {
        res.status(400);
        return res.json(err);
      }

      stream.pipe(res)
      .on('error', err => console.log(err)); // log any errors that occurr during pipe
    });
  });
});

//Save order to the db, create a stripe payment, and email pdf to the user
router.post('/orders', function (req, res) {
  delete req.body.order.orderNum;

  //This token was created client side by the Stripe API, so we do not need credit card details as part of the request
  var stripeToken = req.body.token;
  var order = req.body.order;

  //Cross check all wheelchairs in the order against the JSON, while calculating the total price
  const total = req.body.totalPrice;
  console.log('order\'s total amount is ' + total );
  // Check the total value to make sure its valid...send 400 error if its not
  if (!_.isNumber(total) || (_.isNumber(total) && total <= 0)) {
    res.status(400);
    res.send({err: 'Invalid order'});
    return;
  }

  // returns error value with a charge object ... if payMethod isnt 'Credit Card', just returns {} for charges object
  const createStripeCharge = cb => {
    if (order.payMethod === 'Credit Card') {
      //Create a new stripe payment
      var stripeCharge = stripe.charges.create({
        amount: _.round(total * 100),
        currency: "usd",
        source: stripeToken,
        description: "Tinker order"
      }, cb );
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
    console.log('user data' + req.session.user);
    if (!_.get(req, 'session.user')) {
      return process.nextTick(() => cb(null, {}));
    }

    //Use session cookie to check if user is logged in
    dbUtils.getUserByID(req.session.user, function(err, user) {
      if (!err && _.isObject(user)) { // user was found ... make sure that this order is that users cart order
          var curOrderID = order.id || order._id;
          var userCartID = _.isNull(user.cart) ? null : dbUtils.getObjectID(user.cart, '_id');
          var userOrders = _.isArray(user.orders) ? user.orders : [];

          if (0) {
            cb({status: 400, err: 'Given order was not the users cart order'});
          } else {
             // push the order to the users order history and set cart to null
             const userID = user._id || user.id;
             user.orders.push(order);
             user.cart = null;
             dbUtils.insertUser(user, userID, function (err, minUser) {
              if (err) {
                return cb({status: 500, err: err});
              }
              user._rev = minUser.rev;
              cb(null, user);
             });
          }
      } else {
        // User wasnt logged in when they made the order
        cb(null, {});
      }
    });
  };

  const insertOrder = (isLoggedIn, cb) => {
    if (!isLoggedIn) {
      dbUtils.insertOrder(order, cb);
    } else {
      cb(null, order);
    }
  };
  // takes in boolean representing whether user is logged in & returns order object
  // Only inserts order if user isnt logged in
  const sendInvoiceEmails = (curOrderNum, cb) => {
    order.orderNum = curOrderNum;

    var valuesToSubstitute = {
      '-billingName-': `${order.billingDetails.fName} ${order.billingDetails.lName}`,
      '-billingAddr1-': order.billingDetails.addr,
      '-billingAddr2-': order.billingDetails.addr2,
      '-billingCity-': order.billingDetails.city,
      '-billingState-': order.billingDetails.state,
      '-billingZip-': order.billingDetails.zip,
      '-shippingName-': `${order.shippingDetails.fName} ${order.shippingDetails.lName}`,
      '-shippingAddr1-': order.shippingDetails.addr,
      '-shippingAddr2-': order.shippingDetails.addr2,
      '-shippingCity-': order.shippingDetails.city,
      '-shippingState-': order.shippingDetails.state,
      '-shippingZip-': order.shippingDetails.zip,
      '-grantAmount-': priceCalculator.getTotalGrantAmount(order),
      '-discoun-': priceCalculator.getTotalDiscount(order),
      '-tax-': priceCalculator.getTaxCost(total),
      '-salesTax-': priceCalculator.getTotalTax(order),
      '-shipping-': priceCalculator.getTotalShipping(order),
      '-total-': total,
      '-orderNumber-': order.orderNum,
      '-subtotal-': priceCalculator.getTotalSubtotal(order)
    }

    var invoiceEmail = new sendgrid.Email({
      from: 'do-not-reply@per4max.fit',
      subject: 'Per4max Order #' + order.orderNum + ' - Invoice Attached'
    });

    var manufactureCopy = new sendgrid.Email({
      from: 'do-not-reply@per4max.fit',
      subject: 'Tinker Order #' + order.orderNum + ' - Invoice Attached - MANUFACTURER COPY'
    });

    manufactureCopy.setFilters({"templates": {"settings": {"enabled": 1, "template_id": "ab18bc4d-d178-4cee-866c-b7ef11c486b8"}}});
    invoiceEmail.setFilters({"templates": {"settings": {"enabled": 1, "template_id": "ab18bc4d-d178-4cee-866c-b7ef11c486b8"}}});

    _.forEach(valuesToSubstitute, function(value, key) {
      manufactureCopy.addSubstitution(key, value);
      invoiceEmail.addSubstitution(key, value);
    });

    //Send email to the user containing the invoice as a pdf
    invoiceEmail.to = req.body.order.email;
    invoiceEmail.text = 'Order #:' + order.orderNum + 'Thank you for ordering your new Wheelchair from Per4max. Your invoice is attached here.';
    invoiceEmail.html = '.';
    manufactureCopy.to = MANUFACTURER_EMAIL;
    manufactureCopy.text = 'Order #:' + order.orderNum + '<br> A new order has just been placed. A copy of the invoice is attached here.';
    manufactureCopy.html = '.';

    generatePDF.forInvoice(order, function (err, pdfFileInfo) {
      if (err) {
        cb(err);
      } else {
        const sendInvoiceMail = function (cb) {
          invoiceEmail.addFile({
            path: pdfFileInfo.absPath
          });
          sendgrid.send(invoiceEmail, function (err, json) {
            if (err) {
              console.log(`Error while sending user invoice email:\n${JSON.stringify(err, null, 2)}`);
            }

            cb(err);
          });
        };

        const sendManufacturerEmail = function (cb) {
          manufactureCopy.addFile({
            path: pdfFileInfo.absPath
          });
          sendgrid.send(manufactureCopy, function (err, json) {
            if (err) {
              console.log(`Error while sending manufacturer invoice email:\n${JSON.stringify(err, null, 2)}`);
            }

            cb(err);
          });
        };

        // send the emails out in parallel
        async.parallel([sendInvoiceMail, sendManufacturerEmail], function (err) {
          if (err) {
            cb(err);
          } else {
            cb(null, curOrderNum);
          }
        });


      }
    });
  };

  const updateOrdersOrderNumber = (orderNumber, cb) => {
    order.orderNum = orderNumber;
    dbService.orders.insert(order, order._id, cb);
  };

  validateOrderDiscounts(valid => {
    if (!valid) {
      res.status(400);
      res.json({err: 'Order Discounts were invalid'});
      return;
    }

    createStripeCharge((err, stripeCharge) => {
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

        const userIsLoggedIn = _.isObject(user) && !_.isEmpty(user);
        insertOrder(userIsLoggedIn, (err, order) => {
          if (err) {
            res.status(500);
            res.json({err: err});
            return;
          }

          orderNumber.increment()
          .then(curOrderNum => {
            // Respond with 200 status and user & order number in the response body
            updateOrdersOrderNumber(curOrderNum, function (err) {
              if (err) {
                res.status(400);
                return res.json(err);
              }

              res.json({user: user, orderNum: curOrderNum});

              sendInvoiceEmails(curOrderNum, (err, orderNum) => {
                if (err) {
                  console.log(`ERROR WHILE SENDING INVOICE EMAIL: ${JSON.stringify(err, null, 2)}`);
                }
              });

            });
          })
          .catch(err => {
            res.status(400);
            res.json({err: err});
          });
        });
      });
    });
  });
});

module.exports = router; // expose the router
