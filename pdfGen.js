/**
 * Created by Dhruv on 7/8/2015.
 */
var pdf = require('pdfkit');
var fs = require('fs');

function getPartPreviewImageURL(wheelchair, curPart, subImageIndex, angle) {
  var baseURL = 'app/images/chairPic/';
  var frameIDString = '' + wheelchair.frameID;
  var partIDString = '' + curPart.partID;

  var optionIDString =     curPart.optionID;
  var colorString    = '_' + curPart.colorID;
  var subIndString   = '_' + subImageIndex;
  var angleString    = '_' + angle;
  var partURL = baseURL + 'frame' + frameIDString + '/';
  partURL += 'part' + partIDString + '/';
  partURL += optionIDString + colorString + subIndString + angleString + '.png';

  return partURL;
}

function generateImage(doc, wheelchair, index){
  var angle = '';
  var angleNum = 0;
  switch(index){
    case 0: angle = 'BackRight';
            angleNum = 1;
            break;
    case 1: angle = 'FrontRight';
            angleNum = 3;
            break;
    case 2: angle = 'Right';
            angleNum = 2;
            break;
  }
  var images = [];
  //Generate array of images with zRank's
  for (var i = 0; i < wheelchair.parts.length; i++) {
    var curPart = wheelchair.parts[i];
    var curPartData = wheelchair.pDetails[i];
    var numSubImages = curPartData.numSubImages;
    for (var j = 0; j < numSubImages; j++) {
      images.push({
        URL: getPartPreviewImageURL(wheelchair, curPart, j, angle),
        zRank: curPartData.zRank[j][angleNum]
      });
    }
  }
  //Sort array by zRanks
  images.sort(function (a, b) {
    return (a.zRank - b.zRank);
  });
  for(var k = 0; k<images.length; k++){
    console.log(images[k].zRank);
    doc.image(images[k].URL, 306, 228*index + 36, {width: 234, height: 228});
  }
}

function titlePage(doc, wheelchair, order){
  doc.lineWidth(4).rect( 36, 36, 540, 684).stroke();

  doc.font('Medium').fontSize(24).text(wheelchair.title, 72, 324, {width: 270});
  doc.fontSize(11);
  doc.lineGap(5);
  doc.text('Name:', 72, 370);
  doc.text('Manufacturer:');
  doc.text('Price:');
  doc.text('Model:');
  doc.text('Weight:');
  doc.text('Order Number:');

  doc.font('Book');
  doc.text(order.orderNum);
  doc.text(order.fName +' '+ order.lName, 180, 370);
  doc.text(wheelchair.manufacturer);
  doc.text('$'+wheelchair.price);
  doc.text(wheelchair.model);
  doc.text(wheelchair.weight+'lbs');
  generateImage(doc, wheelchair, 0);
  generateImage(doc, wheelchair, 1);
  generateImage(doc, wheelchair, 2);
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
  doc.image('app/images/invoice/diagram1.png', 315, 158, {width: 234, height: 162});
  doc.image('app/images/invoice/diagram3.png', 117, 468, {width: 131, height: 207});
  doc.image('app/images/invoice/diagram2.png', 365, 473, {width: 131, height: 204});

}

function summaryPage(doc, order){
  doc.addPage({
    size: [612, 792]
  });
  doc.lineWidth(1).moveTo(207, 50).lineTo(207, 272).stroke();
  doc.moveTo(36 ,342).lineTo(576, 342).stroke();
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
  doc.text('Terms:');
  doc.text('Ship Via:');
  doc.font('Book').text(order.sentDate.substr(0, 10), 405, 104);
  doc.text('Net 30');
  doc.text('Best');
  doc.font('Medium').fontSize(13).text('BILL TO:', 221, 180);
  doc.text('SHIP TO:', 405, 180);
  doc.font('Book').fontSize(11).text(order.fName+' '+order.lName, 221, 207);
  doc.text(order.addr);
  doc.text(order.addr2);
  doc.text(order.city+', '+order.state+', '+order.zip);
  doc.text(order.fName+' '+order.lName, 405, 207);
  doc.text(order.addr);
  doc.text(order.addr2);
  doc.text(order.city+', '+order.state+', '+order.zip);
  doc.text('Qty', 36, 320);
  doc.text('Details', 221, 320);
  doc.text('Price', 0, 320, {align:'right'});
  doc.lineGap(6);
  for(var i=0; i<order.wheelchairs.length; i++){
    if(i === 0){
      doc.text('1', 36, 359);
      doc.text(order.wheelchairs[i].title, 221, 359);
      doc.text('$'+order.wheelchairs[i].price.toFixed(2), 0, 359, {align:'right'});
    }
    else{
      doc.text('1', 36);
      doc.moveUp(1);
      doc.text(order.wheelchairs[i].title, 221);
      doc.moveUp(1);
      doc.text('$'+order.wheelchairs[i].price.toFixed(2), {align:'right'});
    }
  }
  doc.moveTo(36 ,441).lineTo(576, 441).stroke();
  doc.text('Sales tax rate:', 36, 458);
  doc.text('9.70%');
  doc.font('Medium').text('Subtotal:', 221, 458);
  doc.text('Shipping:');
  doc.text('Tax:');
  doc.text('Discount:');
  doc.text('Total:', 221, 553);
  doc.font('Book').text('$'+ (order.subtotal).toFixed(2), 0, 458, {align:'right'});
  doc.text('$'+ (order.wheelchairs.length*15).toFixed(2), {align:'right'});
  doc.text('$'+ (0.097*order.subtotal).toFixed(2), {align:'right'});
  doc.text('$0.00', {align:'right'});
  doc.text('$'+ order.total.toFixed(2), 0, 553, {align:'right'});
  doc.moveTo(221, 536).lineTo(576, 536).stroke();
}

exports.generate = function(order){
  var doc = new pdf({
    size: [612, 792]
  });
  var stream = doc.pipe(fs.createWriteStream('invoice_'+order.orderNum+'.pdf'));
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
  summaryPage(doc, order);
  doc.end();
  return stream;
};
