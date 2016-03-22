const _          = require('lodash');
const path       = require('path');
const Handlebars = require('handlebars');
const fs         = require('fs');
const helpers    = require('./handlebar_helpers');

const GENERATED_PDFS_DIR = path.join(os.homedir(), '/invoice_pdfs');

const INVOICE_TEMPLATE_FILEPATH = path.resolve('./invoice_templates/Invoice V3.hbs'); // path.resolve() returns the absolute path given a relative path
const INVOICE_CSS_DIR           = 'file://' + path.resolve('./invoice_templates/Invoice_V3-web-resources/css');//path.resolve('./invoice_templates/Invoice_V3-web-resources/css/');
const INVOICE_IMAGES_DIR        = 'file://' + path.resolve('./invoice_templates/Invoice_V3-web-resources/image');

// To make the above invoice variables accessible from the template, must attach them as helpers
helpers.INVOICE_CSS_DIR    = _.constant(INVOICE_CSS_DIR);
helpers.INVOICE_IMAGES_DIR = _.constant(INVOICE_IMAGES_DIR);

Handlebars.registerHelper(helpers);

// Must read Invoice template contents and store them locally
const INVOICE_TEMPLATE_STR = String(fs.readFileSync(INVOICE_TEMPLATE_FILEPATH));

// compile returns a function that takes in data that acts as the scope for the template and returns the raw HTML string
module.exports = Handlebars.compile(INVOICE_TEMPLATE_STR, {
	'knownHelpers': _.mapValues(helpers, _.constant(true)), // create a map of {<helper name>: true}...this is to optimize the templating
	'knownHelpersOnly': true
});