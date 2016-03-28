const _          = require('lodash');
const path       = require('path');
const Handlebars = require('handlebars');
const os         = require('os');
const fs         = require('fs');
const helpers    = require('./handlebar_helpers');

const GENERATED_PDFS_DIR = path.join(os.homedir(), '/invoice_pdfs');

const APP_PORT = process.env.PORT || 8080;

const INVOICE_TEMPLATE_FILEPATH = path.resolve('./invoice_templates/Invoice V3.hbs'); // path.resolve() returns the absolute path given a relative path
const INVOICE_CSS_URI           = `http://localhost:${APP_PORT}/styles/invoice_v3`;// 'file://' + path.resolve('./invoice_templates/Invoice_V3-web-resources/css');//path.resolve('./invoice_templates/Invoice_V3-web-resources/css/');
const INVOICE_IMAGES_URI        = `http://localhost:${APP_PORT}/images/invoice_v3`;// 'file://' + path.resolve('./invoice_templates/Invoice_V3-web-resources/image');

// To make the above invoice variables accessible from the template, must attach them as helpers
helpers.INVOICE_CSS_URI    = _.constant(INVOICE_CSS_URI);
helpers.INVOICE_IMAGES_URI = _.constant(INVOICE_IMAGES_URI);

Handlebars.registerHelper(helpers);

// Must read Invoice template contents and store it in-memory
const INVOICE_TEMPLATE_STR = String(fs.readFileSync(INVOICE_TEMPLATE_FILEPATH));

/** 
 * 	Handlebars.compile(...) returns a function
 * 	This Function has the following Input/Output
 * 		Input: Scope for the template in the form of a JSON object
 * 		Output: String containing the raw html based on the template and input scope
 */
module.exports = Handlebars.compile(INVOICE_TEMPLATE_STR, {
	'knownHelpers': _.mapValues(helpers, _.constant(true)), // create a map of {<helper name>: true}
	'knownHelpersOnly': true
});