/**
 * Includes all helpers for Handlebars template
 */

var _ = require('lodash');
var frameData = require('../../../../app/data/frameData.json');

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

// Returns the ID for the object it is bound to
function getID() {
  return this.id || this._id;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function displayDate(date) {
  if (!_.isDate(date)) {
    date = new Date(date);
  }

  var monthStr = months[date.getMonth()];
  return `${monthStr}. ${date.getDate()}, ${date.getFullYear()}`;
}

function getChairFrame(wheelchair) {
  var frameID = wheelchair.frameID;
  var chairFrame = _.find(frameData, {"frameID": frameID});

  return chairFrame;
}

function getChairAndFrame(chair) {
  return {
    chair: chair,
    frame: getChairFrame(chair)
  };
}

// Given a chair & measureID, returns the measure choice in cm & in
function getChairMeasureOption(chair, measureID) {
  var frame = getChairFrame(chair);
  var measure = _.find(frame.measures, {'measureID': measureID});
  var measureOptionIndex = _.find(chair.measures, {'measureID': measureID}).measureOptionIndex;

  // Default to the first measaure option
  if (_.isUndefined(measureOptionIndex) || measureOptionIndex < 0) {
    measureOptionIndex = 0;
  }
  
  return {
    'cm': measure.measureOptions[0][measureOptionIndex] || '--',
    'in': measure.measureOptions[1][measureOptionIndex] || '--',
    'weight': measure.weights[measureOptionIndex] || 0
  };
}

function getChairPartOption(chair, partID) {
  var frame = getChairFrame(chair);

  var chairPart = _.find(chair.parts, {'partID': partID});
  var framePart = _.find(frame.parts, {'partID': partID});

  var optionID = chairPart ? chairPart.optionID : framePart.defaultOptionID;

  var chairOption = _.find(framePart.options, {'optionID': optionID});
  return chairOption;
}

// Given a wheelchair and a partID, returns the price of the part for the chair
// frame argument is optional but can be included to speed up
function getChairPartOptionPrice(chair, partID) {
  var frame = frame || getChairFrame(chair);
  
  var chairPart = _.find(chair.parts, {'partID': partID});
  var framePart = _.find(frame.parts, {'partID': partID});

  var optionID = chairPart ? chairPart.optionID : framePart.defaultOptionID;
  var defaultOptionID = framePart.defaultOptionID;

  var chairOption = _.find(framePart.options, {'optionID': optionID});
  var defaultOption = _.find(framePart.options, {'optionID': defaultOptionID});

  if (optionID === defaultOptionID) {
    return defaultOption.price; // return the base price
  } else {
    return defaultOption.price + chairOption.price; // price is base price plus option price difference
  }
}

function calculatePartsSubtotal(chair) {
  var frame = getChairFrame(chair);
  var framePartIDs = _.map(frame.parts, 'partID');

  return framePartIDs.reduce((totalPrice, partID) => {
    var partPrice = getChairPartOptionPrice(chair, partID);
    return totalPrice + partPrice;
  }, 0);
}

function getChairPrice(chair) {
  return calculatePartsSubtotal(chair);
}

function getChairWeight(chair) {
  var frame = getChairFrame(chair);
  var baseWeight = frame.baseWeight;

  var partIDs    = _.map(frame.parts, 'partID');
  var measureIDs = _.map(frame.measures, 'measureID');

  var partsWeight = partIDs.reduce((total, partID) => {
    var partOption = getChairPartOption(chair, partID);
    return total + partOption.weight;
  }, 0);

  var measuresWeight = measureIDs.reduce((total, measureID) => {
    var measure = getChairMeasureOption(chair, measureID);
    return total + measure;
  }, 0);

  return baseWeight + partsWeight + measuresWeight;
}

// Used for a,b,c bulleted lists
function getBulletLetter(index) {
  return String.fromCharCode('A'.charCodeAt(0) + index);
}

module.exports = {
  getPartPreviewImageURL,
  getImageArray,
  getID,
  displayDate,
  getChairFrame,
  getChairAndFrame,
  getChairPrice,
  getChairWeight,
  getChairPartOption,
  getChairMeasureOption,
  getChairPartOptionPrice,
  calculatePartsSubtotal,
  getBulletLetter
};