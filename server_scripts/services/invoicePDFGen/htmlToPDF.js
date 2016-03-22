const _          = require('lodash');
const path       = require('path');
const handlebars = require('handlebars');
const os         = require('os');
const phantom    = require('phantom');

/**
 * This function will spawn a new process which is responsible for creating a single PDF
 * Given: filepath where the output pdf should be saved + a String with raw html
 * Output: Gives path to the PDF file that has been rendered from the input HTML
 * 
 * Internally, the phantom module that is required above creates a child phantomjs process
 * The calls to the phantom instance here are mirrored in the child process and the results are sent
 * back to the local phantom instance via a promise API
 * 
 * The IPC between this proces and the child phantomjs process is just via stdin & stdout so nothing super expensive.
 */
function htmlToPDF(pdfFilePath, rawHTML, cb) {
	console.log(rawHTML);
	phantom.create()
	.then(ph => {
		return ph.createPage()
		.then(page => {
			return page.property('content', rawHTML)
			.then(() => page);
		})
		.then(page => {
			console.log(pdfFilePath);
			// Render the HTML
			page.property('onLoadFinished', status => {
				if (status === 'success') {
					page.render(pdfFilePath, function () {
						ph.exit();
						cb(null, pdfFilePath);
					});
				} else {
					throw new Error("Error During Invoice Generation: Page Didn't load correctly");
				}
			});
		});
	})
	.catch(err => {
		cb(err);
	});
}

module.exports = htmlToPDF;