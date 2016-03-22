/**
 * Includes all helpers for Handlebars template
 */

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

module.exports = {
	getPartPreviewImageURL,
	getImageArray
};