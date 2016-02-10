/**
 * Exposes variables to interact with sendgrid API
 */
"use strict";

//Sendgrid Email API
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

module.exports = sendgrid; // just exposes a logged in sendgrid instance