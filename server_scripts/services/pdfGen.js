/**
 * Created by Dhruv on 7/8/2015.
 */
"use strict";

//Library for pdf generation. Uses pdfkit API to write scripts to generate pdf page by page
//Coordinate system: 72 = 1 in

var pdf = require('pdfkit');
var fs = require('fs');

/***************************************HELPERS***************************/
//Map angles to their array index
var angles = {
    'Back': 0,
    'BackRight': 1,
    'Right': 2,
    'FrontRight': 3,
    'Front': 4
};

//Put the footer at the end of the page
function footer(doc){
  doc.fontSize(11).text('Powered By', 400, 735);
  doc.image('app/images/tinker_logo_small.png', 468, 729, {width: 72});

  var grad = doc.linearGradient(54, 737, 394, 737);
  grad.stop(0, '#91B5FF')
    .stop(1, 'white');

  doc.rect(54, 737, 340, 3);
  doc.fill(grad);
}

//Helper function for generating parts page
function partBlock(doc, wheelchair, onFrame, div){
  var count = 0;
  var parts = [];
  for (var i = 0; i < wheelchair.parts.length; i++) {
    if(wheelchair.pDetails[i].onFrame !== onFrame)
      continue;
    if (count === 0)
      doc.font('Medium').text(wheelchair.pDetails[i].name, 280, div+18);
    else
      doc.font('Medium').text(wheelchair.pDetails[i].name, 280);
    if (wheelchair.pDetails[i].color !== true)
      doc.lineWidth(11).moveTo(368, div + 22 + count * 39).lineTo(379, div + 22 + count * 39).fillAndStroke(wheelchair.pDetails[i].color, wheelchair.pDetails[i].color);
    doc.fillAndStroke('black', 'black');
    doc.font('Book').text(wheelchair.pDetails[i].option, 298);
    doc.moveUp(1).text('$' + wheelchair.pDetails[i].price, 500);
    count++;
    parts.push(wheelchair.pDetails[i]);
  }

  var nextDiv = div + Math.max(40 * count + 18, 234);
  generateImage(doc, wheelchair, parts, 'FrontRight', {x: 72, y: div+66}, 153);

  doc.lineWidth(1).moveTo(54, nextDiv).lineTo(558, nextDiv).stroke();

  return nextDiv;
}

/*****************IMAGES********************************************/
//Get the url for the images based on the wheelchair part
function getPartPreviewImageURL(wheelchair, curPart, subImageIndex, angle) {
  var baseURL = 'app/images/chairPic/';
  var frameIDString = '' + wheelchair.frameID;
  var partIDString = '' + curPart.partID;

  var optionIDString = curPart.optionID;
  var colorString = '_' + curPart.colorID;
  var subIndString = '_' + subImageIndex;
  var angleString = '_' + angle;
  var partURL = baseURL + 'frame' + frameIDString + '/';
  partURL += 'part' + partIDString + '/';
  partURL += optionIDString + colorString + subIndString + angleString + '.png';
  return partURL;
}

//Return the z-rank sorted image array used to draw the wheelchair parts
function getImageArray(wheelchair, parts, angle) {
  var images = [];
  //Generate array of images with zRank's
  for (var i = 0; i < parts.length; i++) {
    var curPart = parts[i];
    var numSubImages = curPart.numSubImages;
    for (var j = 0; j < numSubImages; j++) {
      images.push({
        URL: getPartPreviewImageURL(wheelchair, curPart, j, angle),
        zRank: curPart.zRank[j][angles[angle]]
      });
    }
  }
  //Sort array by zRanks
  images.sort(function (a, b) {
    return (a.zRank - b.zRank);
  });
  return images;
}

//Generate an image of the wheelchair and place it on the pdf
function generateImage(doc, wheelchair, parts, angle, coords, width) {
  var images = getImageArray(wheelchair, parts, angle);
  for (var k = 0; k < images.length; k++) {
    doc.image(images[k].URL, coords.x, coords.y, {width: width}); //Draw the images
  }
}


/****************************PAGES***************************************************/
//Generate the title page
function titlePage(doc, wheelchair, order) {
  doc.lineGap(1);
  doc.font('Medium').fontSize(22).text(wheelchair.title.toUpperCase(), 72, 535); //Main title
  doc.lineWidth(1).moveTo(72, 562).lineTo(540, 562).stroke();
  doc.fontSize(12);
  doc.lineGap(5);

  doc.text('', 72, 581);  //Start writing labels at (72, 581). Following text automatically on newline
  if (order)
    doc.text('Name:', 72, 581);
  doc.text('Manufacturer:');
  doc.text('Price:');
  doc.text('Model:');
  doc.text('Weight:');
  if (order)
    doc.text('Order Number:');

  doc.font('Book');
  doc.text('', 207, 581); //Back at (, 581). Start writing values for the given labels
  if (order)
    doc.text(order.fName + ' ' + order.lName, 207, 581);
  doc.text(wheelchair.manufacturer);
  doc.text('$' + wheelchair.price.toFixed(2));
  doc.text(wheelchair.model);
  doc.text(wheelchair.weight.toFixed(2) + 'lbs');
  if (order)
    doc.text(order.orderNum);

  //Generate images
  generateImage(doc, wheelchair, wheelchair.pDetails, 'Back', {x: 486, y: 36}, 90);
  generateImage(doc, wheelchair, wheelchair.pDetails, 'FrontRight', {x: 486, y: 109}, 90);
  generateImage(doc, wheelchair, wheelchair.pDetails, 'Right', {x: 486, y: 182}, 90);
  generateImage(doc, wheelchair, wheelchair.pDetails, 'BackRight', {x: 36, y: 36}, 450);

  footer(doc);
}

//Generate the parts page
function partsPage(doc, wheelchair) {
  var subtotal = 0;

  doc.addPage({
    size: [612, 792],
    margin: 0
  });

  doc.font('Book').fontSize(11).text('Type', 72, 72);
  doc.text('Details', 280, 72);
  doc.text('Price', 500, 72);

  doc.lineWidth(1).moveTo(54, 90).lineTo(558, 90).stroke();
  doc.lineGap(9);

  doc.font('Medium').text('Frame', 72, 108);

  //Draw the details for the frame parts
  var firstDiv = partBlock(doc, wheelchair, true, 90);

  doc.font('Medium').text('Wheel', 72, firstDiv + 18);

  //Draw the details for the wheel parts
  var secondDiv = partBlock(doc, wheelchair, false, firstDiv);

  doc.font('Medium').text('Subtotal', 280, secondDiv + 18);
  doc.font('Book').text('$' + subtotal, 500, secondDiv + 18);

  footer(doc);
}

//Generate the measurements page
function measuresPage(doc, wheelchair) {
  doc.addPage({
    size: [612, 792],
    margin: 0
  });
  doc.font('Medium').text('Measurements', 72, 72);
  doc.lineWidth(1).moveTo(54, 90).lineTo(558, 90).stroke();
  doc.lineGap(9);

  for (var i = 0; i < wheelchair.mDetails.length; i++) {
    if (i === 0)
      doc.font('Medium').text(wheelchair.mDetails[i].name, 72, 108);
    else
      doc.font('Medium').text(wheelchair.mDetails[i].name, 72);
    doc.font('Book').text(wheelchair.mDetails[i].selection, 90);
  }

  doc.image('app/images/invoice/diagram1.png', 315, 158, {height: 162});
  doc.image('app/images/invoice/diagram3.png', 117, 468, {height: 207});
  doc.image('app/images/invoice/diagram2.png', 365, 473, {height: 204});
  doc.font('Book');

  for (var j = 0; j < wheelchair.mDetails.length; j++) {
    if (wheelchair.mDetails[j].name === 'Foot Rest Width') {
      doc.text(wheelchair.mDetails[j].val, 178, 650);
    }
    else if (wheelchair.mDetails[j].name === 'Rear Seat Width') {
      doc.text(wheelchair.mDetails[j].val, 433, 653);
    }
    else if (wheelchair.mDetails[j].name === 'Front Seat Height') {
      doc.text(wheelchair.mDetails[j].val, 293, 260);
    }
    else if (wheelchair.mDetails[j].name === 'Rear Seat Height') {
      doc.text(wheelchair.mDetails[j].val, 525, 270);
    }
  }

  footer(doc);
}

//Generate the summary page
function summaryPage(doc, order) {
  doc.addPage({
    size: [612, 792],
    margin: 0
  });
  doc.lineWidth(1).moveTo(207, 50).lineTo(207, 272).stroke();
  doc.moveTo(36, 342).lineTo(576, 342).stroke();
  doc.lineGap(1);
  doc.font('Book').fontSize(11).text('60 Hazelwood Dr.', 36, 104);
  doc.text('Suite 110');
  doc.text('Champaign, IL, 61820');
  doc.moveDown(1);
  doc.text('Phone: (217) 903-4563');
  doc.text('Fax: (217) 332-1560');
  doc.text('www.intelliwheels.net');
  doc.font('Medium').fontSize(18).text('SUMMARY', 221, 52);
  doc.fontSize(11).text('Purchase Date:', 221, 104);
  doc.text('Payment Terms:');
  doc.text('Ship Via:');
  doc.font('Book').text(order.sentDate.substr(0, 10), 405, 104);
  if (order.payMethod === 'paypal')
    doc.text('30% down/70% before delivery');
  else
    doc.text('Bill Insurance');
  doc.text('Best');
  doc.font('Medium').fontSize(13).text('BILL TO:', 221, 180);
  doc.text('SHIP TO:', 405, 180);
  doc.font('Book').fontSize(11).text(order.fName + ' ' + order.lName, 221, 207);
  doc.text(order.addr);
  doc.text(order.addr2);
  doc.text(order.city + ', ' + order.state + ', ' + order.zip);
  doc.text(order.fName + ' ' + order.lName, 405, 207);
  doc.text(order.addr);
  doc.text(order.addr2);
  doc.text(order.city + ', ' + order.state + ', ' + order.zip);
  doc.text('Qty', 36, 320);
  doc.text('Details', 221, 320);
  doc.text('Price', 0, 320, {align: 'right'});
  doc.lineGap(6);
  for (var i = 0; i < order.wheelchairs.length; i++) {
    if (i === 0) {
      doc.text('1', 36, 359);
      doc.text(order.wheelchairs[i].title, 221, 359);
      doc.text('$' + order.wheelchairs[i].price.toFixed(2), 0, 359, {align: 'right'});
    }
    else {
      doc.text('1', 36);
      doc.moveUp(1);
      doc.text(order.wheelchairs[i].title, 221);
      doc.moveUp(1);
      doc.text('$' + order.wheelchairs[i].price.toFixed(2), {align: 'right'});
    }
  }
  doc.moveTo(36, 441).lineTo(576, 441).stroke();
  doc.text('Sales tax rate:', 36, 458);
  doc.text('9.70%');
  doc.font('Medium').text('Subtotal:', 221, 458);
  doc.text('Shipping:');
  doc.text('Tax:');
  doc.text('Discount:');
  doc.text('Total:', 221, 553);
  doc.font('Book').text('$' + (order.subtotal).toFixed(2), 0, 458, {align: 'right'});
  doc.text('$' + (order.wheelchairs.length * 15).toFixed(2), {align: 'right'});
  doc.text('$' + (0.097 * order.subtotal).toFixed(2), {align: 'right'});
  doc.text('$0.00', {align: 'right'});
  doc.text('$' + order.total.toFixed(2), 0, 553, {align: 'right'});
  doc.moveTo(221, 536).lineTo(576, 536).stroke();

  footer(doc);
}


/*****************************Library functions****************************************/

//Generates the main pages for a given wheelchair
function genPdf(doc, chairNum, wheelchair, order) {
  if (chairNum !== 0) //If not the first wheelchair, add a new page to the pdf
    doc.addPage({
      size: [612, 792],
      margin: 0
    });
  titlePage(doc, wheelchair, order);  //Generate the title page for wheelchair
  partsPage(doc, wheelchair);         //Generate the parts page for wheelchair
  measuresPage(doc, wheelchair);      //Generate the measures page for wheelchair
}

//Function to create pdf for a single wheelchair, excludes invoice summary, and stream it back to client as response
exports.generateSave = function (wheelchair, res) {
  //Create the new pdf variable
  var doc = new pdf({
    size: [612, 792],
    margin: 0
  });

  //Stream directly to the API response
  var stream = doc.pipe(res);

  //Register font names for ease of use
  doc.registerFont('Book', 'fonts/Gotham-Book.ttf');
  doc.registerFont('Medium', 'fonts/Gotham-Medium.ttf');

  genPdf(doc, 0, wheelchair, null); //Generate the pdf for this wheelchair

  doc.end();  //End stream
};

//Function to create invoice pdf for an order, and save it in the server file system.
exports.generateInvoice = function (order) {
  //Create the new pdf variable
  var doc = new pdf({
    size: [612, 792],
    margin: 0
  });

  //Stream to a new pdf file
  var stream = doc.pipe(fs.createWriteStream('invoice_' + order.orderNum + '.pdf'));

  //Register font names for ease of use
  doc.registerFont('Book', 'fonts/Gotham-Book.ttf');
  doc.registerFont('Medium', 'fonts/Gotham-Medium.ttf');

  for (var i = 0; i < order.wheelchairs.length; i++) {
    genPdf(doc, i, order.wheelchairs[i], order);  //For each wheelchair generate pdf pages
  }
  summaryPage(doc, order);  //Generate summary page for the invoice
  //End stream
  doc.end();
  return stream;
};
