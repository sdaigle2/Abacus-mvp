const _ = require('lodash');
const puppeteer = require('puppeteer');

/**
 * This function is shifted to Puppeteer on 6/15/2023 previously used Phantom and jsreport 
 */


async function htmlToPDF(args, cb) {
	const pdfFilePath = args.pdfFilePath;
	const rawHTML = args.rawHTML;

	try {
		const browser = await puppeteer.launch({
			headless: 'new'
		});
		const page = await browser.newPage();
		await page.setContent(rawHTML);

		const pdfOptions = {
			path: pdfFilePath,
			format: 'Letter',
			margin: {
				top: '0px',
				right: '0px',
				bottom: '0px',
				left: '0px'
			},
			printBackground: true
		};

		await page.pdf(pdfOptions);
		await browser.close();

		cb(null, pdfFilePath);
	} catch (err) {
		console.log('PDF function error:', err);
		cb(err);
	}
}

module.exports = htmlToPDF;
