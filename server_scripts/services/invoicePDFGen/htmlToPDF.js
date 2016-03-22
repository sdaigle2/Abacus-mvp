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
	cb = _.once(cb); // ensure the callback is only called once
	console.log(rawHTML);
	// Create the phantomjs process and direct it to generate the pdf
	phantom.create()
	.then(ph => {
		return ph.createPage(['--local-to-remote-url-acces=yes'])
		.then(page => {
			return page.setting('localToRemoteUrlAccessEnabled', true)
			.then(() => {
				return page.property('onConsoleMessage', function(msg, lineNum, sourceId) {
  					console.log('CONSOLE: ' + JSON.stringify(msg) + ' (from line #' + lineNum + ' in "' + sourceId + '")');
				});
			})
			.then(() => {
				return page.property('onResourceError', err => {
					console.log(JSON.stringify(err, null, 2));
				});
			})
			.then(() => page);
		})
		.then(page => {
			return page.setContent(rawHTML, 'file:///')
			.then(() => page);
		})
		.then(page => {
			console.log(pdfFilePath);
			// Render the HTML
			return page.property('onLoadFinished', status => {
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