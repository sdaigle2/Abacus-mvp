/**
 * Endpoints for sending PDF invoices and making orders
 */
"use strict";

var router = require('express').Router();
var _      = require('lodash');

// Import services
var verifyOrder        = require('../services/data').verifyOrder;
var verifyChair        = require('../services/data').verifyWheelchair;
var genInvoice         = require('../services/pdfGen').generateInvoice;
var genSave            = require('../services/pdfGen').generateSave;
var generateInvoicePDF = require('../services/generateInvoicePDF');
var stripe             = require('../services/stripe');
var sendgrid           = require('../services/sendgrid');
var dbService          = require('../services/db');

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

  //Cross check all wheelchairs in the order against the JSON, while calculating the total price
  var total = verifyOrder(req.body.order, true);
  //The order is valid
  if (total !== false) {
    //Create a new stripe payment
    var charge = stripe.charges.create({
      amount: Math.round(total * 30), // Amount in cents
      currency: "usd",
      source: stripeToken,
      description: "Tinker order"
    }, function (err, charge) {
      //If there was an error and the user didn't opt to pay by insurance
      if (err && req.body.order.payMethod === 'paypal') {
        console.log(err);
        res.json({err: err.type});
      }
      else {  //Successful payment or the user if paying through insurance
        var order = req.body.order;
        // Replace items wheelchairs array with just wheelchair IDs
        order.wheelchairs = _.isArray(order.wheelchairs) ? order.wheelchairs : [];
        order.wheelchairs = order.wheelchairs.map(function (wheelchair) {
          if (_.isObject(wheelchair)) {
            return wheelchair._id;
          }
          return wheelchair; // the wheelchair is just an ID
        });

        dbService.orders.insert(order, function (err, body) { //Insert the order into the database
          order.orderNum = body.id;   //Set the id for the order using the id given by the database
          res.send(body.id);

          //Set up the invoice email
          var invoiceEmail = new sendgrid.Email({
            from: 'do-not-reply@tinker.fit',
            subject: 'Per4max Purchase Invoice'
          });

          var manufactureCopy = new sendgrid.Email({
            from: 'do-not-reply@tinker.fit',
            subject: 'Per4max Purchase Invoice'
          });

          //Use session cookie to check if user is logged in
          dbService.users.get(req.session.user, function(err, existing){
            //If user is logged in, add the order to their entry in the database as well
            if(existing.orders) {
              existing.orders.push(req.body.order);
              dbService.users.insert(existing, function (err, body) {
                console.log(err);
              });
            }
          });

          //Send email to the user containing the invoice as a pdf
          invoiceEmail.to = req.body.order.email;
          invoiceEmail.text = 'Thank you for using Abacus to purchase your new Wheelchair. We have attached the invoice for your order.';
          manufactureCopy.to = 'sales@intelliwheels.net'
          manufactureCopy.text = 'an order just been placed, here is a copy of the invoice'
          generateInvoicePDF(order, function (err, pdfPath) {
            if (err) {
              // Probably should do more than just log the error here
              console.log(err);
            } else {
              invoiceEmail.addFile({
                path: pdfPath
              });
              sendgrid.send(invoiceEmail, function (err, json) {
                console.log(err);
              });
              manufactureCopy.addFile({
                path: pdfPath
              });
              sendgrid.send(manufactureCopy, function (err, json) {
                console.log(err);
              });


            }
          });
        });
      }
    });
  }
  else
    res.send({err: 'Invalid order'});
});

module.exports = router; // expose the router
