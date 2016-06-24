/**
 * Includes all helpers for Handlebars templating engine
 */

const _ = require('lodash');
const frameData = require('../../../../app/data/frameData.json');
const frameIDMap = _.mapValues(_.groupBy(frameData, 'frameID'), _.first);

const CLOUDFRONT_BASE_URL = 'http://duqb7w6xgn312.cloudfront.net/';
const APP_PORT = process.env.PORT || 8080; // make sure this is consistent with the port in server.js
//Map angles to their array index
const angles = {
    'Back': 0,
    'BackRight': 1,
    'Right': 2,
    'FrontRight': 3,
    'Front': 4
};

function getImageKey(wheelchair, curPart, subImageIndex) {
  var frameIDString = '' + wheelchair.frameID;
  var partIDString = '' + curPart.partID;

  var optionIDString = curPart.optionID;
  var colorString = `_${curPart.colorID}`;
  var subIndString = `_${subImageIndex}`;
  var angleString = '_FrontRight';
  return `frame${frameIDString}/part${partIDString}/${optionIDString}${colorString}${subIndString}${angleString}.png`;
}

/**
 * Get the url for the images based on the wheelchair part
 */
function getPartPreviewImageURL(wheelchair, curPart, subImageIndex) {
  return `${CLOUDFRONT_BASE_URL}${getImageKey(wheelchair, curPart, subImageIndex)}`;
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
        src: getPartPreviewImageURL(wheelchair, curPart, j),
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
  const frameID = wheelchair.frameID;
  return frameIDMap[frameID];
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
  var chairMeasure = _.find(chair.measures, {'measureID': measureID});
  console.log(`chair: ${JSON.stringify(chair, null, 2)}`);
  console.log(`chairMeasure: ${JSON.stringify(chairMeasure, null, 2)}`);
  var frame = getChairFrame(chair);
  var measure = _.find(frame.measures, {'measureID': measureID});
  var measureOptionIndex = _.find(chair.measures, {'measureID': measureID}).measureOptionIndex;

  // Default to the first measure option
  if (_.isUndefined(measureOptionIndex) || measureOptionIndex < 0) {
    measureOptionIndex = -1;
  }

  return {
    'name': measure.name || '--',
    'cm': measure.measureOptions[0][measureOptionIndex] || '--',
    'in': measure.measureOptions[1][measureOptionIndex] || '--',
    'weight': measure.weights[measureOptionIndex] || 0,
    'unit': measure.units[1],
    'comments': chairMeasure.comments || 'No Comments'
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
 * Given a chair and an optionID, returns option configuration within the chair
 */
function getChairOption(chair, optionID) {
  return _.find(chair.parts || [], {'optionID': optionID});
}

/**
 * Given a chair and an optionID, returns the size associated with that part option
 */
function getOptionSize(chair, optionID) {
  var frame = getChairFrame(chair);
  var chairOption = getChairOption(chair, optionID);

  if (_.isUndefined(chairOption)) {
    return '--';
  }

  var framePart = _.find(frame.parts, {'partID': chairOption.partID});
  var frameOption = _.find(framePart.options, {'optionID': optionID});

  var sizeIdx = chairOption.sizeIndex || frameOption.defaultSizeIndex;

  if (sizeIdx < 0 || _.isUndefined(sizeIdx)) {
    return '--';
  }

  return frameOption.sizes[sizeIdx];
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
 * Returns the all option details object for a given chair and PartID
 */
function getChairPartOptions(chair, partID) {
  var frame = getChairFrame(chair);

  var chairParts = _.filter(chair.parts, {'partID': partID});
  var framePart = _.find(frame.parts, {'partID': partID});

  var optionIDs = _.isEmpty(chairParts) ? [framePart.defaultOptionID] : _.map(chairParts, 'optionID') ;

  // Search through all the options for the given frame Part,
  // and only keep the ones with an option ID that is present in optionIDs
  var chairOptions = _.filter(framePart.options, framePartOption => {
    return _.find(optionIDs, optID => optID === framePartOption.optionID);
  });

  return chairOptions;
}

/**
 * Given a wheelchair and a partID, returns the price of the part for the chair
 */
function getChairPartOptionPrice(chair, optionID) {
  var frame = getChairFrame(chair);

  var chairPart = _.find(chair.parts, {'optionID': optionID});
  var framePart = _.find(frame.parts, {'partID': chairPart.partID});

  var optionID = chairPart ? optionID : framePart.defaultOptionID;
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
 * Given a chair and a option ID, returns the comment associated with that option
 * If no comment was made for the option, returns a default 'No Comment' text
 */
function getChairOptionComment(chair, optionID) {
  var option = _.find(chair.parts, {'optionID': optionID});
  return option.comments || 'No Comments';
}

/**
 * Given a chair, a partID, and a color ID, returns the name of the color for the frame of the chair
 * If no colorID is given, assumes default colorID
 */
function getChairOptionColorName(chair, optionID) {
  var frame = getChairFrame(chair);
  var option = getChairOption(chair, optionID);
  var part  = _.find(frame.parts, {'partID': option.partID});

  if (_.isUndefined(part)) {
    return '--'; // text that represents Unavailable
  }

  var frameOption = _.find(part.options, {'optionID': optionID});

  var colorID = option.colorID || frameOption.defaultColorID;

  var color = _.find(frameOption.colors, {'colorID': colorID});
  if (_.has(color, 'name')) {
    return color.name;
  }

  return '--';
}

/**
 * Adds up cost of each part in the wheelchair configuration and returns it
 */
function calculatePartsSubtotal(chair) {
  var frame = getChairFrame(chair);
  var optionIDs = _.chain(frame.parts)
    .map('partID')
    .map(partID => getChairPartOptions(chair, partID))
    .flatten()
    .map('optionID')
    .value();

  var basePrice = _.isNumber(frame.basePrice) ? frame.basePrice : 0;
  var partsPrice = _.sumBy(optionIDs, optionID => getChairPartOptionPrice(chair, optionID));

  return basePrice + partsPrice;
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
  return subTotal + getChairShippingCost(chair) + getTaxCost.apply(order, [subTotal]) - chair.grantAmount;
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
  return _.sumBy(chairs, chair => calculatePartsSubtotal(chair)) - getTotalGrantAmount();
}

/**
 * Get the total discount amount for the current order
 * Based on Discounts in the order.discounts array
 */
function getTotalDiscount() {
  var subTotal = getTotalSubtotal.apply(this);
  var discountPercent = 1;
  this.discounts.forEach(function(discount){
    discountPercent *= (1 - discount.percent);
  });

  return subTotal * (1-discountPercent);
}

function getTotalGrantAmount() {
  return _.sumBy(this.wheelchairs, 'wheelchair.grantAmount');
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

function getChairImageObjects(chair) {
  // If the images attribute is attached, just return that since it contains the pngs in base64 string encoded format
  if (_.has(chair, 'images') && _.isArray(chair.images)) {
    return chair.images.map(imgStr => ({src: imgStr}));
  }

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

  return getImageArray(chair, chairParts);
}

/**
 * Given a wheelchair configuration
 * returns all images for visualzing the wheelchair from a FrontRight angle in zRank order
 * Each value in the returned images array can be used directly as a value for the 'src' attribute in an img element
 */
function getChairImages(chair) {
  var images = getChairImageObjects(chair);
  return _.map(images, 'src'); // just return the image URLs in z-rank order
}

/**
 * Given a string, will return the same string with all chars uppercased
 * If input isn't a string, the value itself will be returned unchanged
 */
function toUpperCase(str) {
  return _.isString(str) ? str.toUpperCase() : str;
}

/**
 * Following constants are to aid in invoice parts/measurement page pagination
 */

const LINES_PER_PAGE = 28;
const LINES_PER_PART = 3; // doesnt include comment line, that is taken into account seperately
const LINES_PER_MEASURE = 2; // doesnt include comment line, that is taken into account seperately
// number of characters that a comment can have to be considered taking up a full line
const COMMENT_LINE_LENGTH = 55;

/**
 * Given a wheelchair, returns an array of arrays of parts for that wheelchair
 * This is used in paginating the wheelchairs parts page to prevent overflow
 * Takes length of comments into account
 */
function getPaginatedParts(chair) {
  var frame = getChairFrame(chair);
  var chairOptions = _.flatten( frame.parts.map(part => {
    return getChairPartOptions(chair, part.partID)
      .map(option => {
        return {
          'part': part,
          'option': option
        };
      });
  }));


  const estimatePageLines = parts => {
    var partComments = parts.map(part => _.isString(part.option.comments) ? part.option.comments : '');

    var partLines = parts.length * LINES_PER_PART;
    var commentLines = _.sumBy(partComments, comment => (comment.length / COMMENT_LINE_LENGTH) + 1);

    return partLines + commentLines;
  };

  const paginatedOptions = chairOptions.reduce((paginatedArray, option) => {
    var curPage = _.last(paginatedArray);
    if (estimatePageLines(curPage.concat(option)) >= LINES_PER_PAGE) {
      // Adding this option to the page would exceed the line limit, add this option to a new page
      paginatedArray.push([option]);
    } else {
      curPage.push(option);
    }

    return paginatedArray;
  }, [[]]);

  return paginatedOptions;
}

/**
 * Given a wheelchair, returns an array of arrays of parts for that wheelchair
 * This is used in paginating the wheelchairs parts page to prevent overflow
 * Takes length of comments into account
 */
function getPaginatedMeasures(chair) {
  var chairMeasures = chair.measures;

  const estimatePageLines = measures => {
    var measureComments = measures.map(measure => _.isString(measure.comments) ? measure.comments : '');

    var measureLines = measures.length * LINES_PER_MEASURE;
    var commentLines = _.sumBy(measureComments, comment => (comment.length / COMMENT_LINE_LENGTH) + 1);
    return measureLines + commentLines;
  };

  const paginatedMeasures = chairMeasures.reduce((paginatedArray, measure) => {
    var curPage = _.last(paginatedArray);
    if (estimatePageLines(curPage.concat(measure)) >= LINES_PER_PAGE) {
      // Adding this measure to the page would exceed the line limit, add this measure to a new page
      paginatedArray.push([measure]);
    } else {
      curPage.push(measure);
    }

    return paginatedArray;
  }, [[]]);

  return paginatedMeasures;
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
  getOptionSize,
  getChairPartOption,
  getChairPartOptions,
  getChairMeasureOption,
  getChairMeasureOptionByName,
  getChairPartOptionPrice,
  getChairOptionComment,
  getChairOptionColorName,
  calculatePartsSubtotal,
  getBulletLetter,
  getChairImageObjects,
  getChairImages,
  getTaxCost,
  getTotalShipping,
  getTotalTax,
  getTotalSubtotal,
  getTotalDiscount,
  getTotalPrice,
  toUpperCase,
  getPaginatedParts,
  getPaginatedMeasures,
  getImageKey,
  getTotalGrantAmount
};

// Wrap all functions to round integers to nearest decimal
module.exports = _.mapValues(EXPORTED_HELPERS, function (fn) {
  var wrapperFn = function () {
    var returnVal = fn.apply(this, arguments);
    return _.isNumber(returnVal) ? returnVal.toFixed(2) : returnVal;
  };

  return wrapperFn;
});
