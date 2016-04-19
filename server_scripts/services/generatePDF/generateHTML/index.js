const _               = require('lodash');
const path            = require('path');
const Handlebars      = require('handlebars');
const os              = require('os');
const fs              = require('fs');
const helpers         = require('./handlebar_helpers');

const APP_PORT = process.env.PORT || 8080;

const INVOICE_TEMPLATE_FILEPATH = path.resolve(__dirname, '../invoice_templates/Invoice V4.hbs'); // path.resolve() returns the absolute path given a relative path
const WHEELCHAIRS_TEMPLATE_FILEPATH = path.resolve(__dirname, '../invoice_templates/wheelchairs.hbs');
const INVOICE_CSS_URI           = `http://localhost:${APP_PORT}/styles/invoice/`;// 'file://' + path.resolve('./invoice_templates/Invoice_V3-web-resources/css');//path.resolve('./invoice_templates/Invoice_V3-web-resources/css/');
const INVOICE_IMAGES_URI        = `http://localhost:${APP_PORT}/images/invoice_v3/`;// 'file://' + path.resolve('./invoice_templates/Invoice_V3-web-resources/image');

// To make the above invoice variables accessible from the template, must attach them as helpers
helpers.INVOICE_CSS_URI    = _.constant(INVOICE_CSS_URI);
helpers.INVOICE_IMAGES_URI = _.constant(INVOICE_IMAGES_URI);

Handlebars.registerHelper(helpers);

// Must read Invoice template contents and store it in-memory, same with wheelchair pdf template
const INVOICE_TEMPLATE_STR = String(fs.readFileSync(INVOICE_TEMPLATE_FILEPATH));
const WHEELCHAIRS_TEMPLATE_STR = String(fs.readFileSync(WHEELCHAIRS_TEMPLATE_FILEPATH));


/** 
 * 	Handlebars.compile(...) returns a function
 * 	This Function has the following Input/Output
 * 		Input: Scope for the template in the form of a JSON object
 * 		Output: String containing the raw html based on the template and input scope
 */

// Generates HTML for an invoice
exports.forInvoice = Handlebars.compile(INVOICE_TEMPLATE_STR, {
	'knownHelpers': _.mapValues(helpers, _.constant(true)), // create a map of {<helper name>: true}
	'knownHelpersOnly': true
});

// Generates HTML for an array of designs
exports.forWheelchairs = Handlebars.compile(WHEELCHAIRS_TEMPLATE_STR, {
	'knownHelpers': _.mapValues(helpers, _.constant(true)), // create a map of {<helper name>: true}
	'knownHelpersOnly': true
});