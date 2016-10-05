/**
 * Endpoints for sending PDF invoices and making orders
 */
"use strict";

let router = require('express').Router();
const _      = require('lodash');
const async  = require('async');
const Promise = require('bluebird');
// Import services
const generatePDF     = require('../services/generatePDF');
const priceCalculator = require('../services/priceCalculator');
const stripe          = require('../services/payment');
const paypal          = require('../services/paypal');
let sendgrid        = require('../services/sendgrid');
const dbService       = require('../services/db');
const orderNumber     = require('../services/orderNumber');
const dbUtils         = require('../services/dbUtils');
const restrict = require('../policies/restrict');

const getUserPr = Promise.promisify(dbService.users.get);
const getOrderPr = Promise.promisify(dbService.orders.get);
const insertUserPr = Promise.promisify(dbService.users.insert);
const insertOrderPr = Promise.promisify(dbService.orders.insert);
// Manufacturer Email to send invoices to
const MANUFACTURER_EMAIL = ['sales@per4max.com', 'ckommer@per4max.com', 'dfik@per4max.com', 'colivas@per4max.com', 'p4x@intelliwheels.net'];
//const MANUFACTURER_EMAIL = ['scott@intelliwheels.net', 'sdaigle@pdipaxton.com'];
console.log(`NOTE: Invoice Emails will be sent to Manufacturer at this email: ${MANUFACTURER_EMAIL}`);

// returns error value with a charge object ... if payMethod isnt 'Credit Card', just returns {} for charges object
const createStripeCharge = function(total, stripeToken, order, cb) {
  let payType = order.payType || order;

  if (total && payType === 'Credit Card') {
    //Create a new stripe payment
    var stripeCharge = stripe.charges.create({
      amount: _.round(total * 100), // check this value
      currency: "usd",
      source: stripeToken,
      description: "Tinker order"
    }, cb );
  } else {
    cb(null, {});
  }
};

function createStatus(total, now) {
  if (now === 0) return {'orderStatus': 'waiting for 50% payment before starting to build your chair', 'paymentStatus': 'incomplete'};
  if (now > 0 && now < total / 2) return {'orderStatus': 'waiting for 50% payment before starting to build your chair', 'paymentStatus': 'incomplete'};
  if (now !== total && now >= total / 2) return {'orderStatus': 'Thankyou for the downpayment, we’ll start building your wheelchair now. Please note that you will need to pay the remainder before the order ships.', 'paymentStatus': 'At least 50% paid'};
  if (now === total) return {'orderStatus': 'Full payment has been received. Chair will ship once it is complete.', 'paymentStatus': 'Paid in full'};
}

router.get('/orders/:id', restrict, function(req, res) {
  getUserPr(req.session.user)
  .then(function(user) {
    const userType = user.userType;
    if (userType !== 'admin' && userType !== 'superAdmin') {
      res.status(401);
      res.json({msg: 'Only admin users are authorized to perform this operation.'});
      return;
    }
    return getOrderPr(req.params.id)
  })
  .then(function(order) {
      res.json(order)
    })
  .catch(err => {
    res.status(400);
    res.json({err: err});
  });
});

router.get('/orders', restrict, function(req, res) {
  getUserPr(req.session.user)
  .then(function(user) {
    const userType = user.userType;
    if (userType !== 'admin' && userType !== 'superAdmin') {
      res.status(401);
      res.json({msg: 'Only admin users are authorized to perform this operation.'});
      return;
    }
    dbService.orders.list({include_docs: true}, function(err, body){
      if (err) {
        res.status(400);
        res.json({err: 'Error while getting users'});
        return;
      }
      res.json(body);
    });
  })
  .catch(err => {
    res.status(400);
    res.json({err: err});
  });
});

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

router.put('/orders/:id', restrict, function(req, res) {
  getUserPr(req.session.user)
  .then(function(user) {
    const userType = user.userType;
    if (userType !== 'admin' && userType !== 'superAdmin') {
      res.status(401);
      res.json({msg: 'Only admin users are authorized to perform this operation.'});
      return;
    } else if (req.body.stripeToken) {
      let total = req.body.order.payments[req.body.order.payments.length - 1].amount;
      createStripeCharge(total, req.body.stripeToken, 'Credit Card', function(err, resp) {
        if (err) {
          res.status(400);
          res.json({err: 'Error while processing credit card payment'});
          return;
        }
        delete req.body.order.stripeToken;
        return insertOrderPr(req.body.order);
      })

    } else {
      return insertOrderPr(req.body.order);
    }
    
  })
  .then(resp => {
      res.json(resp);
    })
  .catch(err => {
    res.status(400);
    res.json({err: err});
  });
});

router.post('/orders/create-payment', (req, res) => {
  const total = Number(req.body.paymentAmount.toFixed(2));
  const payType = req.body.payType;
  const order = req.body.order;
  const stripeToken = req.body.token || '';
  const creditCard = req.body.creditCard;
  const checkNumber = req.body.checkNum || '';
  const memo = req.body.memo || '';

  dbUtils.getOrderByID(order._id, (err, order) => {
    let previousPayments = order.totalDue - order.totalDueLater;
    createStripeCharge(total, stripeToken, payType, (err, stripeCharge) => {
      if (err) {
        res.status(400);
        res.json({err: 'Error while processing credit card payment'});
        return;
      }

      order.payments.push({
        "date": new Date(),
        "method": payType,
        "amount": total,
        "checkNumber": checkNumber,
        "ccNum": creditCard ? creditCard.number.substr(creditCard.number.length - 4) : '',
        "stripeId": stripeToken,
        "memo": memo
      });

      delete order.totalDueNow;
      order.totalDueLater = order.totalDueLater - total;
      let status = createStatus(order.totalDue, order.totalDue - order.totalDueLater);
      order.orderStatus = status.orderStatus;
      order.paymentStatus = status.paymentStatus;
      insertOrderPr(order)
      .then(resp => {
        let valuesToSubstitute = {
          '-paymentStatus-': order.paymentStatus,
          '-orderStatus-': order.orderStatus,
          '-totalDue-': order.totalDue.toFixed(2),
          '-previousPayments-': previousPayments.toFixed(2),
          '-amountPaid-': total.toFixed(2),
          '-balanceDue-':order.totalDueLater.toFixed(2),
          '-orderNumber-': order.orderNum.toString(),
        };

        sendgrid.sendReceipt('do-not-reply@per4max.fit', MANUFACTURER_EMAIL , 'Per4max.fit Payment Receipt for Order #' + order.orderNum + ' - MANUFACTURER COPY', valuesToSubstitute, cb);
        sendgrid.sendReceipt('do-not-reply@per4max.fit', [req.body.order.email] , 'Per4max.fit Payment Receipt for Order #' + order.orderNum, valuesToSubstitute, cb);
        res.json(resp)

        function cb(err, resp) {
          if (err) console.log(err);
        }
      })
      .catch(err => {
        res.status(400);
        res.json({err: err});
      });
    });
  });
});

//Save order to the db, create a stripe payment, and email pdf to the user
router.post('/orders', function (req, res) {

  delete req.body.order.orderNum;
  //This token was created client side by the Stripe API, so we do not need credit card details as part of the request
  const stripeToken = req.body.token;
  const order = req.body.order;
  const creditCard = req.body.cc;
  const checkNumber = req.body.checkNum || '';

  //Cross check all wheelchairs in the order against the JSON, while calculating the total price
  const total = req.body.totalPrice;

  console.log('order\'s total amount is ' + total );
  // Check the total value to make sure its valid...send 400 error if its not
  if (!_.isNumber(total) || (_.isNumber(total) && total < 0)) {
    res.status(400);
    res.send({err: 'Invalid order'});
    return;
  }

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
  // takes in boolean representing whether user is logged in & returns order object
  // Only inserts order if user isnt logged in
  const sendInvoiceEmails = (curOrderNum, cb) => {
    order.orderNum = curOrderNum;

    const amt = priceCalculator.getOrderTotal(order) - total;

    const valuesToSubstitute = {
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
      '-grantAmount-': priceCalculator.getTotalGrantAmount(order).toFixed(2),
      '-discount-': priceCalculator.getTotalDiscount(order).toFixed(2),
      '-tax-': priceCalculator.getTaxCost(total).toFixed(2),
      '-salesTax-': priceCalculator.getTotalTax(order).toFixed(2),
      '-shipping-': priceCalculator.getTotalShipping(order).toFixed(2),
      '-total-': priceCalculator.getOrderTotal(order).toFixed(2),
      '-orderNumber-': order.orderNum.toString(),
      '-subtotal-': priceCalculator.getTotalSubtotal(order).toFixed(2),
      '-amtPaid-': total.toFixed(2),
      '-balanceDue-': amt.toFixed(2)
    };

    order.totalDueNow = total.toFixed(2);
    generatePDF.forInvoice(order, function (err, pdfFileInfo) {
      if (err) {
        cb(err);
      } else {
        var pdf = {
          path: pdfFileInfo.absPath,
          name: 'pdfInvoice.pdf'
        }
        sendgrid.sendInvoice('do-not-reply@per4max.fit', MANUFACTURER_EMAIL , 'Per4max.fit Order #' + order.orderNum + ' - Invoice Attached - MANUFACTURER COPY', valuesToSubstitute, pdf, cb);
        sendgrid.sendInvoice('do-not-reply@per4max.fit', [req.body.order.email] , 'Per4max.fit Order #' + order.orderNum + ' - Invoice Attached', valuesToSubstitute, pdf, cb);

        function cb(err, resp) {
          if (err) console.log(err);
        }
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

    createStripeCharge(total, stripeToken, order, (err, stripeCharge) => {
      if (err) {
        res.status(400);
        res.json({err: 'Error while processing credit card payment'});
        return;
      }
      order.totalDueLater = Number(order.totalDueLater);

      order.totalDue = Number(priceCalculator.getOrderTotal(order));
      order.payments = _.isArray(order.payments) ? order.payments : [];
      if (total > 0) {
        order.payments.push({
          "date": new Date(),
          "method": order.payType,
          "amount": total,
          "checkNumber": checkNumber,
          "ccNum": creditCard ? creditCard.number.substr(creditCard.number.length - 4) : '',
          "stripeId": stripeToken,
          "memo": "initial payment"
        });
      }

      delete order.totalDueNow;

      dbUtils.insertOrder(order, function(err, resp) {
        if (err) {
            res.status(400);
            res.json({err: 'Error while inserting order'});
            return;
          }
        getUserPr(req.session.user)
        .then(function(user) {
          user.orders.push(order._id);
          user.cart = null;
          // updatee userObject
          insertUserPr(user)
          .then((resp) => {
            user._rev = resp.rev;
            user._id = resp.id;
            user.rev = resp.rev;
            user.id = resp.id;

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
});

router.mockSendgrid = function(mock) {
  sendgrid = mock;
}

module.exports = router; // expose the router

