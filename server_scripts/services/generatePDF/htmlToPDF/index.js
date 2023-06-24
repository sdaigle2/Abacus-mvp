const PCR = require('puppeteer-chromium-resolver');
const fs = require('fs');
const { Readable } = require('stream');


async function htmlToPDF(args, cb) {
  const pdfFilePath = args.pdfFilePath;
  const rawHTML = args.rawHTML;

  try { 
    const options = { timeout: 60000 };
    const stats = await PCR(options);
    const browser = await stats.puppeteer.launch({
      // headless: false,
      executablePath: stats.executablePath, // Adjust the executable path according to your environment
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    await page.setContent(rawHTML);

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    if (!pdfFilePath) {
      // If no file path to save the PDF was given, return the raw stream for the PDF
      const stream = new Readable();
      stream.push(pdfBuffer);
      stream.push(null);
      cb(null, stream);
    } else {
      fs.writeFile(pdfFilePath, pdfBuffer, (err) => {
        if (err) {
          console.error('PDF write file error:', err);
          cb(err);
        } else {
          console.log('PDF file created:', pdfFilePath);
          cb(null, pdfFilePath);
        }
      });
    }
  } catch (err) {
    console.error('HTML to PDF conversion error:', err);
    cb(err);
  }
}

module.exports = htmlToPDF;
