const fs = require('fs');
const htmlToPdf = require('html-pdf-node');

async function htmlToPDF(args, cb) {
  const pdfFilePath = args.pdfFilePath;
  const rawHTML = args.rawHTML;

  try {
    const file = { content: rawHTML };
    const options = { format: 'A4' };

    const pdfBuffer = await htmlToPdf.generatePdf(file, options);
    fs.writeFile(pdfFilePath, pdfBuffer, (err) => {
      if (err) {
        console.error('PDF write file error:', err);
        cb(err);
      } else {
        cb(null, pdfFilePath);
      }
    });
  } catch (err) {
    console.error('HTML to PDF conversion error:', err);
    cb(err);
  }
}

module.exports = htmlToPDF;
