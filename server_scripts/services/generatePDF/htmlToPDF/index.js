const fs = require('fs');
const phantom = require('phantom-html-to-pdf')();

async function htmlToPDF(args, cb) {
  const pdfFilePath = args.pdfFilePath;
  const rawHTML = args.rawHTML;

  try {
    phantom({ html: rawHTML }, (err, pdf) => {
      if (err) {
        console.error('HTML to PDF conversion error:', err);
        cb(err);
      } else {
        const output = fs.createWriteStream(pdfFilePath);
        pdf.stream.pipe(output);
        output.on('finish', () => {
          cb(null, pdfFilePath);
        });
        output.on('error', (error) => {
          console.error('PDF write stream error:', error);
          cb(error);
        });
      }
    });
  } catch (err) {
    console.error('HTML to PDF conversion error:', err);
    cb(err);
  }
}

module.exports = htmlToPDF;
