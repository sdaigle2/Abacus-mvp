const os                  = require('os');
const path                = require('path');
const generateInvoiceHTML = require('./generateInvoiceHTML');
const htmlToPDF           = require('./htmlToPDF');
const _                   = require('lodash');

const GENERATED_PDFS_DIR = path.join(os.homedir(), 'invoice_pdfs/');

const TIMEOUT_PER_CHAIR = 6e3;
const TIMEOUT_PER_INVOICE = 2e3;

function getOrderInvoiceFilename(order) {
	const orderID = order.id || order._id;
	return `order_${orderID}_invoice.pdf`;
}

/**
 * Estimates a timeout value that is appropriate for the nuber of wheelchairs that
 * need to be rendered for the invoice
 * timeout length is estimated by increasing timeout linearly with number of chairs + a constant timeout length
 */
function getTimeoutLength(order) {
	return (order.wheelchairs.length * TIMEOUT_PER_CHAIR) + TIMEOUT_PER_INVOICE;
}

// function pasteDebugHTML(html) {
// 	console.log('NOTE TO DEVELOPER: REMOVE pasteDebugHTML FUNCTION BEFORE DEPLOYING.....ITS JUST FOR DEVELOPMENT');
// 	var fs = require('fs');
// 	fs.writeFileSync(path.resolve(__dirname, './invoice_templates/test.html'), html);
// }

function generateInvoicePDF(order, cb) {
	const invoiceHTML = generateInvoiceHTML(order);
	// pasteDebugHTML(invoiceHTML);
	const invoiceRenderingTimeout = getTimeoutLength(order);
	
	const invoiceFilename = getOrderInvoiceFilename(order);
	const invoiceFilePath = path.join(GENERATED_PDFS_DIR, invoiceFilename);

	htmlToPDF(invoiceFilePath, invoiceHTML, invoiceRenderingTimeout, cb);
}

module.exports = generateInvoicePDF;