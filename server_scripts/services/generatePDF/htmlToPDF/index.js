const pdf = require('html-pdf');
const fs = require('fs');

function htmlToPDF(args, cb) {
  const pdfFilePath = args.pdfFilePath;
  const rawHTML = args.rawHTML;

  pdf.create(rawHTML).toFile(pdfFilePath, function(err, res) {
    if (err) {
      console.error('PDF creation error:', err);
      cb(err);
    } else {
      console.log('PDF file created:', res.filename);
      cb(null, res.filename);
    }
  });
}

module.exports = htmlToPDF;
