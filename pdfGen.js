/**
 * Created by Dhruv on 7/8/2015.
 */
var pdf = require('pdfkit');
var fs = require('fs');

function titlePage(doc, wheelchair, order){
  doc.lineWidth(4).rect( 36, 36, 540, 684).stroke();

  doc.font('Medium').fontSize(24).text(wheelchair.title, 72, 324);
  doc.fontSize(11);
  doc.lineGap(5);
  doc.text('Name:', 72, 370);
  doc.text('Manufacturer:');
  doc.text('Price:');
  doc.text('Model:');
  doc.text('Weight:');
  doc.text('Order Number:');

  doc.font('Book');
  doc.text(order.fName +' '+ order.lName, 180, 370);
  doc.text(wheelchair.manufacturer);
  doc.text('$'+wheelchair.price);
  doc.text(wheelchair.model);
  doc.text(wheelchair.weight+'lbs');
  doc.text(order.orderNum);
}

function partsPage(doc, wheelchair){
  var subtotal = 0;

  doc.addPage({
    size: [612, 792]
  });
  doc.lineWidth(4).rect( 36, 36, 540, 684).stroke();

  doc.font('Book').text('Type', 72, 72);
  doc.text('Details', 280, 72);
  doc.text('Price', 500, 72);

  doc.lineWidth(1).moveTo(54, 90).lineTo(558,90).stroke();
  doc.lineGap(9);

  for(var i=0; i<wheelchair.wheelIndex; i++) {
    if (i === 0)
      doc.font('Medium').text(wheelchair.pDetails[i].name, 280, 108);
    else
      doc.font('Medium').text(wheelchair.pDetails[i].name, 280);
    doc.font('Book').text(wheelchair.pDetails[i].option, 298);
    doc.moveUp(1).text('$' + wheelchair.pDetails[i].price, 500);
    subtotal += wheelchair.pDetails[i].price;
  }

  var firstDiv = 90 + Math.max(40*wheelchair.wheelIndex+18, 234);
  doc.lineWidth(1).moveTo(54, firstDiv).lineTo(558, firstDiv).stroke();

  for(var j=wheelchair.wheelIndex; j<wheelchair.pDetails.length; j++){
    if(j === wheelchair.wheelIndex)
      doc.font('Medium').text(wheelchair.pDetails[j].name, 280, firstDiv+18);
    else
      doc.font('Medium').text(wheelchair.pDetails[j].name, 280);
    doc.font('Book').text(wheelchair.pDetails[j].option, 298);
    doc.moveUp(1).text('$' + wheelchair.pDetails[j].price, 500);
    subtotal += wheelchair.pDetails[j].price;
  }

  var secondDiv = firstDiv + Math.max(18 + 40*(wheelchair.pDetails.length - wheelchair.wheelIndex), 234);
  doc.lineWidth(1).moveTo(54, secondDiv).lineTo(558, secondDiv).stroke();

  doc.font('Medium').text('Subtotal', 280, secondDiv+18);
  doc.font('Book').text('$'+subtotal, 500, secondDiv+18);
}

function measuresPage(doc, wheelchair){
  doc.addPage({
    size: [612, 792]
  });
  doc.lineWidth(4).rect( 36, 36, 540, 684).stroke();
  doc.font('Medium').text('Measurements', 72, 72);
  doc.lineWidth(1).moveTo(54, 90).lineTo(558,90).stroke();
  doc.lineGap(9);

  for(var i=0; i<wheelchair.mDetails.length; i++) {
    if (i === 0)
      doc.font('Medium').text(wheelchair.mDetails[i].name, 72, 108);
    else
      doc.font('Medium').text(wheelchair.mDetails[i].name, 72);
    doc.font('Book').text(wheelchair.mDetails[i].selection, 90);
  }
}

exports.generate = function(order){
  var doc = new pdf({
    size: [612, 792]
  });
  var stream = doc.pipe(fs.createWriteStream('invoices/invoice_'+order.orderNum+'.pdf'));
  doc.registerFont('Book', 'fonts/Gotham-Book.ttf');
  doc.registerFont('Medium', 'fonts/Gotham-Medium.ttf');
  for(var i = 0; i<order.wheelchairs.length; i++) {
    if(i!==0)
      doc.addPage({
        size: [612, 792]
      });
    titlePage(doc, order.wheelchairs[i], order);
    partsPage(doc, order.wheelchairs[i]);
    measuresPage(doc, order.wheelchairs[i]);
  }
  doc.end();
};
