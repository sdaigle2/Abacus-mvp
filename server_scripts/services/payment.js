/**
 * Exposes variables to interact with Stripe API
 */
"use strict";

//Stripe Payment API
var stripe = require("stripe")(process.env.STRIPE_TKEY);
module.exports = stripe; // just exposes logged in stripe instance



