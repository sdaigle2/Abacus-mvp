const _          = require('lodash');
const fs         = require('fs');
const jsreport   = require('jsreport');

/**
 * This function will spawn a new process which is responsible for creating a single PDF
 * Given: filepath where the output pdf should be saved + a String with raw html
 * Output: Gives path to the PDF file that has been rendered from the input HTML
 * 
 * More info on jsreport module used: http://www.janblaha.net/blog/converting-html-to-pdf-in-nodejs
 */
function htmlToPDF(pdfFilePath, rawHTML, cb) {
	cb = _.once(cb); // ensure the callback is only called once
	console.log(rawHTML);
	jsreport.render(rawHTML)
	.then(out => {
		var stream = out.result.pipe(fs.createWriteStream(pdfFilePath));
		
		stream.on('finish', () => cb(null, pdfFilePath));
		stream.on('error', err => cb(err));
	})
	.catch(err => {
		cb(err);
	});
}

module.exports = htmlToPDF;