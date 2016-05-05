/**
 * Exposes variables to interact with Stripe API
 */
"use strict";

//Stripe Payment API
var stripe = require("stripe")(process.env.STRIPE_TKEY);

module.exports = stripe; // just exposes logged in stripe instance


//paypal setup
var paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'Aet-dK0J0USNh5dbBjafAcxSUiH5xGjNib6hFnDAoTSiC_DM9ghJoUrz0UBXTKFNUvmizlJbLtJNx8oR',
  'client_secret': process.env.Paypal_Secret
});

module.exports = paypal;
