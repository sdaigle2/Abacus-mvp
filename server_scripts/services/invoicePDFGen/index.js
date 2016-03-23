const os                  = require('os');
const path                = require('path');
const generateInvoiceHTML = require('./generateInvoiceHTML');
const htmlToPDF           = require('./htmlToPDF');

const GENERATED_PDFS_DIR = path.join(os.homedir(), 'invoice_pdfs/');

function getOrderInvoiceFilename(order) {
	var orderID = order.id || order._id;
	return `order_${orderID}_invoice.pdf`;
}

function generateInvoicePDF(order, cb) {
	const invoiceHTML = generateInvoiceHTML(order);

	const invoiceFilename = getOrderInvoiceFilename(order);
	const invoiceFilePath = path.join(GENERATED_PDFS_DIR, invoiceFilename);

	htmlToPDF(invoiceFilePath, invoiceHTML, cb);
}

module.exports = generateInvoicePDF;