/**
 * Includes all helpers for Handlebars templating engine
 */

const _ = require('lodash');
const frameData = require('../../../../app/data/frameData.json');

const APP_PORT = process.env.PORT || 8080; // make sure this is consistent with the port in server.js
//Map angles to their array index
const angles = {
    'Back': 0,
    'BackRight': 1,
    'Right': 2,
    'FrontRight': 3,
    'Front': 4
};

/**
 * Get the url for the images based on the wheelchair part
 */
function getPartPreviewImageURL(wheelchair, curPart, subImageIndex) {
  var baseURL = `http://localhost:${APP_PORT}/images/chairPic/`;
  var frameIDString = '' + wheelchair.frameID;
  var partIDString = '' + curPart.partID;

  var optionIDString = curPart.optionID;
  var colorString = `_${curPart.colorID}`;
  var subIndString = `_${subImageIndex}`;
  var angleString = '_FrontRight';
  var partURL = `${baseURL}frame${frameIDString}/`;
  partURL += `part${partIDString}/`;
  partURL += `${optionIDString}${colorString}${subIndString}${angleString}.png`;
  return partURL;
}

/**
 * Return the z-rank sorted image array used to draw the wheelchair parts
 */
function getImageArray(wheelchair, parts) {
  var images = [];
  //Generate array of images with zRank's
  for (var i = 0; i < parts.length; i++) {
    var curPart = parts[i];
    var numSubImages = curPart.numSubImages;
    for (var j = 0; j < numSubImages; j++) {
      images.push({
        URL: getPartPreviewImageURL(wheelchair, curPart, j),
        zRank: curPart.zRank[j][angles['FrontRight']]
      });
    }
  }
  //Sort array by zRanks
  images.sort(function (a, b) {
    return (a.zRank - b.zRank);
  });
  return images;
}

/**
 * Returns the ID for the object it is bound to
 */
function getID() {
  return this.id || this._id;
}

/**
 * Abreviated months in chronological order
 */
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Given a date or a date string
 * Returns the date as a string in a human readable format i.e. Mar 25, 2016
 */
function displayDate(date) {
  if (!_.isDate(date)) {
    date = new Date(date);
  }

  var monthStr = months[date.getMonth()];
  return `${monthStr}. ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Get the Frame object for corresponding to the given wheelchair object
 */
function getChairFrame(wheelchair) {
  var frameID = wheelchair.frameID;
  var chairFrame = _.find(frameData, {"frameID": frameID});

  return chairFrame;
}

/**
 * given a wheelchair object, returns an object containg both the chair and its corresponding frame object
 * useful so that you can have both in a single scope within handlebars
 */
function getChairAndFrame(chair) {
  return {
    chair: chair,
    frame: getChairFrame(chair)
  };
}

/**
 * Given a chair, returns the all the measures that need to be set for that chair
 */
function getChairMeasures(chair) {
  var frame = getChairFrame(chair);
  return frame.measures;
}

/**
 * Given a chair & measureID, returns the measure choice in cm & in as well as the weight
 */
function getChairMeasureOption(chair, measureID) {
  var frame = getChairFrame(chair);
  var measure = _.find(frame.measures, {'measureID': measureID});
  var measureOptionIndex = _.find(chair.measures, {'measureID': measureID}).measureOptionIndex;

  // Default to the first measure option
  if (_.isUndefined(measureOptionIndex) || measureOptionIndex < 0) {
    measureOptionIndex = -1;
  }
  
  return {
    'cm': measure.measureOptions[0][measureOptionIndex] || '--',
    'in': measure.measureOptions[1][measureOptionIndex] || '--',
    'weight': measure.weights[measureOptionIndex] || 0
  };
}

/**
 * Given a chair & measureName, returns the measure choice in cm, & inches as well as the weight
 */
function getChairMeasureOptionByName(chair, measureName) {
  var frame = getChairFrame(chair);
  var measure = _.find(frame.measures, {'name': measureName});
  
  if (measure) {
    return getChairMeasureOption(chair, measure.measureID);
  } else {
    return undefined;
  }
}

/**
 * Returns the option details object given a chair and a PartID
 */
function getChairPartOption(chair, partID) {
  var frame = getChairFrame(chair);

  var chairPart = _.find(chair.parts, {'partID': partID});
  var framePart = _.find(frame.parts, {'partID': partID});

  var optionID = chairPart ? chairPart.optionID : framePart.defaultOptionID;

  var chairOption = _.find(framePart.options, {'optionID': optionID});
  return chairOption;
}

/**
 * Given a wheelchair and a partID, returns the price of the part for the chair
 */
function getChairPartOptionPrice(chair, partID) {
  var frame = getChairFrame(chair);

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

/**
 * Adds up cost of each part in the wheelchair configuration and returns it
 */
function calculatePartsSubtotal(chair) {
  var frame = getChairFrame(chair);
  var framePartIDs = _.map(frame.parts, 'partID');

  return _.sumBy(framePartIDs, partID => {
    return getChairPartOptionPrice(chair, partID);
  });
}

/**
 * Gets the shipping cost for the given chair
 */
function getChairShippingCost(chair) {
  var frame = getChairFrame(chair);
  return _.get(frame, 'shippingInfo.cost') || 0;
}

/**
 * Given a input subtotal (w/o shipping fee), returns the tax fee for that price
 */
function getTaxCost(total) {
  return 0; // tax cost for everything is 0% ... might change later
}

/**
 * Get's total chair price including subtotal, shipping, tax, & discounts
 */
function getChairPrice(chair, order) {
  var subTotal = calculatePartsSubtotal(chair);
  return subTotal + getChairShippingCost(chair) + getTaxCost.apply(order, [subTotal]);
}

/**
 * Returns total shipping fee for the whole order
 */
function getTotalShipping() {
  var chairs = _.map(this.wheelchairs, 'wheelchair');
  return _.sumBy(chairs, getChairShippingCost);
}

/**
 * Returns total tax fee for the whole order
 */
function getTotalTax() {
  var chairs = _.map(this.wheelchairs, 'wheelchair');

  var getTaxCostBound = getTaxCost.bind(this);
  
  var taxFees = chairs
    .map(calculatePartsSubtotal)
    .map(subTotal => getTaxCostBound(subTotal));

  return _.sum(taxFees);
}

/**
 * Returns total subtotal for the whole order
 */
function getTotalSubtotal() {
  var chairs = _.map(this.wheelchairs, 'wheelchair');
  return _.sumBy(chairs, chair => calculatePartsSubtotal(chair, this));
}

/**
 * Get the total discount amount for the current order
 * Based on Discounts in the order.discounts array
 */
function getTotalDiscount() {
  var subTotal = getTotalSubtotal.apply(this);
  return this.discounts.reduce((total, discount) => total * discount.percent, subTotal);
}

/**
 * Returns total cost for the whole order
 */
function getTotalPrice() {
  var chairs = _.map(this.wheelchairs, 'wheelchair');
  var getChairPriceBound = getChairPrice.bind(this);
  return _.sumBy(chairs, chair => getChairPriceBound(chair, this));
}


/**
 * Gives total weight of a given chair
 */
function getChairWeight(chair) {
  var frame = getChairFrame(chair);
  var baseWeight = frame.baseWeight;

  var partIDs    = _.map(frame.parts, 'partID');
  var measureIDs = _.map(frame.measures, 'measureID');

  var partsWeight = _.sumBy(partIDs, partID => {
    var partOption = getChairPartOption(chair, partID);
    return (partOption.weight || 0);
  });

  var measuresWeight = _.sumBy(measureIDs, measureID => {
    var measure = getChairMeasureOption(chair, measureID);
    return measure.weight;
  });

  return baseWeight + partsWeight + measuresWeight;
}

/**
 * Converts integers 0-25 into their Letter equivalents
 * i.e. 0 -> A, 1 -> B, 2 -> C ...
 * Used for A,B,C bulleted lists
 */
// 
function getBulletLetter(index) {
  return String.fromCharCode('A'.charCodeAt(0) + index);
}

/**
 * Given a wheelchair configuration
 * returns all images for visualzing the wheelchair from a FrontRight angle in zRank order
 */
function getChairImages(chair) {
  var frame = getChairFrame(chair);
  var chairParts = chair.parts.map(partOption => {
    var part = _.find(frame.parts, {'partID': partOption.partID});
    
    return {
      partID: partOption.partID,
      colorID: partOption.colorID,
      optionID: partOption.optionID,
      numSubImages: part.numSubImages,
      zRank: part.zRank
    };
  });

  var images = getImageArray(chair, chairParts);
  return _.map(images, 'URL'); // just return the image URLs in z-rank order
}

/**
 * Given a string, will return the same string with all chars uppercased
 * If input isn't a string, the value itself will be returned unchanged
 */
function toUpperCase(str) {
  return _.isString(str) ? str.toUpperCase() : str;
}

/**
 * Export all the functions so they can be used by Handlebars templating engine
 */
const EXPORTED_HELPERS = {
  getPartPreviewImageURL,
  getImageArray,
  getID,
  displayDate,
  getChairFrame,
  getChairAndFrame,
  getChairMeasures,
  getChairPrice,
  getChairWeight,
  getChairPartOption,
  getChairMeasureOption,
  getChairMeasureOptionByName,
  getChairPartOptionPrice,
  calculatePartsSubtotal,
  getBulletLetter,
  getChairImages,
  getTaxCost,
  getTotalShipping,
  getTotalTax,
  getTotalSubtotal,
  getTotalDiscount,
  getTotalPrice,
  toUpperCase,
};

// Wrap all functions to round integers to nearest decimal
module.exports = _.mapValues(EXPORTED_HELPERS, function (fn) {
  var wrapperFn = function () {
    var returnVal = fn.apply(this, arguments);
    return _.isNumber(returnVal) ? returnVal.toFixed(2) : returnVal;
  };

  return wrapperFn;
});
