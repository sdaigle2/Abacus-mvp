const os                  = require('os');
const fs                  = require('fs');
const path                = require('path');
const generateHTML        = require('./generateHTML')
const htmlToPDF           = require('./htmlToPDF');
const _                   = require('lodash');
const shortid             = require('shortid');

const GENERATED_PDFS_DIR = path.join(os.homedir(), 'generated_pdfs/');

exports.GENERATED_PDFS_DIR = GENERATED_PDFS_DIR;

// Check if the PDF directory exists, if it doesn't, create it
if (!fs.existsSync(GENERATED_PDFS_DIR)) {
	console.log(`Making PDF directory at: ${GENERATED_PDFS_DIR}`);
	fs.mkdirSync(GENERATED_PDFS_DIR);
}

const TIMEOUT_PER_CHAIR = 6e3;
const TIMEOUT_PER_INVOICE = 3e3;

function getOrderInvoiceFilename(order) {
	const orderID = order.id || order._id;
	return `order_${orderID}_invoice.pdf`;
}

// generates a unique filename for a wheelchair pdf that is to be generated
function getWheelchairsPDFFilename(designs) {
	designs = _.isArray(designs) ? designs : [designs]; // might just be given a single design object
	return `wheelchairs_${shortid.generate()}_${Math.random()}_${designs.length}.pdf`
}

/**
 * Estimates a timeout value that is appropriate for the nuber of wheelchairs that
 * need to be rendered for the invoice
 * timeout length is estimated by increasing timeout linearly with number of chairs + a constant timeout length
 * Input argument can be an order object or a list of wheelchairs
 */
function getTimeoutLength(order) {
	var wheelchairs = _.isArray(order) ? order : order.wheelchairs;
	return (wheelchairs.length * TIMEOUT_PER_CHAIR) + TIMEOUT_PER_INVOICE;
}

// function pasteDebugHTML(html) {
// 	console.log('NOTE TO DEVELOPER: REMOVE pasteDebugHTML FUNCTION BEFORE DEPLOYING.....ITS JUST FOR DEVELOPMENT');
// 	var fs = require('fs');
// 	fs.writeFileSync(path.resolve(__dirname, './invoice_templates/test.html'), html);
// }

function generateInvoicePDF(order, asStream, cb) {
	if (_.isFunction(asStream)) {
		cb = asStream;
		asStream = false;
	}

	const invoiceHTML = generateHTML.forInvoice(order);
	// pasteDebugHTML(invoiceHTML);
	const invoiceRenderingTimeout = getTimeoutLength(order);
	
	const invoiceFilename = getOrderInvoiceFilename(order);
	const invoiceFilePath = path.join(GENERATED_PDFS_DIR, invoiceFilename);
	
	const pdfGenArgs = {
		rawHTML: invoiceHTML,
		timeout: invoiceRenderingTimeout
	};

	if (!asStream) {
		pdfGenArgs.pdfFilePath = invoiceFilePath;
	}

	htmlToPDF(pdfGenArgs, function (err, res) {
		if (err) {
			return cb(err);
		}
		if (asStream) {
			var stream = res;
			cb(null, stream);
		} else {
			cb(null, {filename: invoiceFilename, absPath: res});
		}
	});
}

exports.forInvoice = generateInvoicePDF;

// takes in array of designs (or single designs) and generates PDF for it
// callback will return a stream for the PDF, not an absolute path to it like generateInvoicePDF (see above)
function generateWheelchairsPDF(wheelchairs, asStream, cb) {
	if (_.isFunction(asStream)) {
		cb = asStream;
		asStream = false;
	}

	wheelchairs = _.isArray(wheelchairs) ? wheelchairs : [wheelchairs]; // can be given a single wheelchair or an array of them

	const pdfHTML = generateHTML.forWheelchairs(wheelchairs);
	// pasteDebugHTML(invoiceHTML);
	const pdfRenderingTimeout = getTimeoutLength(wheelchairs);

	const pdfFilename = getWheelchairsPDFFilename(wheelchairs);
	const pdfFilePath = path.join(GENERATED_PDFS_DIR, pdfFilename);

	const pdfGenArgs = {
		rawHTML: pdfHTML,
		timeout: pdfRenderingTimeout
	};

	if (!asStream) {
		pdfGenArgs.pdfFilePath = pdfFilePath;
	}

	htmlToPDF(pdfGenArgs, function (err, res) {
		if (err) {
			return cb(err);
		}
		if (asStream) {
			var stream = res;
			cb(null, stream);
		} else {
			cb(null, {filename: pdfFilename, absPath: res});
		}
	});
}

exports.forWheelchairs = generateWheelchairsPDF;