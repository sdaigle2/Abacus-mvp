const os                  = require('os');
const path                = require('path');
const generateInvoiceHTML = require('./generateInvoiceHTML');
const htmlToPDF           = require('./htmlToPDF');

const GENERATED_PDFS_DIR = path.join(os.homedir(), 'invoice_pdfs/');

function getOrderInvoiceFilename(order) {
	const orderID = order.id || order._id;
	return `order_${orderID}_invoice.pdf`;
}

// function pasteDebugHTML(html) {
// 	console.log('NOTE TO DEVELOPER: REMOVE pasteDebugHTML FUNCTION BEFORE DEPLOYING.....ITS JUST FOR DEVELOPMENT');
// 	var fs = require('fs');
// 	fs.writeFileSync(path.resolve(__dirname, './invoice_templates/test.html'), html);
// }

function generateInvoicePDF(order, cb) {
	const invoiceHTML = generateInvoiceHTML(order);
	// pasteDebugHTML(invoiceHTML);
	const invoiceFilename = getOrderInvoiceFilename(order);
	const invoiceFilePath = path.join(GENERATED_PDFS_DIR, invoiceFilename);

	htmlToPDF(invoiceFilePath, invoiceHTML, cb);
}

module.exports = generateInvoicePDF;