/**
 * Created by Dhruv on 7/7/2015.
 */
"use strict";

//Verify wheelchair and order data sent from the client.

//The json containing all the correct frame data
var frameData = require('../../app/data/frameData.json');
var _ = require('lodash');

//Return the frame with given frameID
function getFrame(frameID) {
  for (var i = 0; i < frameData.length; i++) {
    if (frameData[i].frameID === frameID) {
      return frameData[i];
    }
  }
  console.log('Bad frame Id');
  return false;
}

/************************************PARTS***************************************/
//Return part with the given partID
function getPart(partID, parts) {
  var part = _.find(parts, {'partID': partID});
  return _.isUndefined(part) ? false : part;
}

//Return option with given optionID
function getOption(optionID, options) {
  var option = _.find(options, {'optionID': optionID});
  return _.isUndefined(option) ? false : option;
}

//Verify size with given index exists
function verifySize(index, sizes) {
  if (index >= 0 && index < sizes.length)
    return sizes[index];
  return _.isArray(sizes) && sizes.length === 0 && index === -1;
}

//Verify color with given id exists
function verifyColor(colorID, colors) {
  if (colors) {
    var color = _.find(colors, {'colorID': colorID});
    return _.isUndefined(color) ? false : color.hex;
  }
  return (!colors || colors.length === 0) && colorID === 0;
}

//Verify that all the details of the given part are correct
function verifyPart(framePart, chairPart, wheelchair) {
  var option = getOption(chairPart.optionID, framePart.options);  //Check JSON for corresponding option
  if (option) {
    //var size = verifySize(chairPart.sizeIndex, option.sizes); //Check JSON for corresponding size
    //var hex = verifyColor(chairPart.colorID, option.colors);  //Check JSON for corresponding color
    if (1) {
      wheelchair.weight += option.weight;
      //Append additional part details to the wheelchair
      wheelchair.pDetails.push({
        name: framePart.name,
        option: option.name,
        price: option.price,
        zRank: framePart.zRank,
        numSubImages: framePart.numSubImages,
        onFrame: framePart.onFrame,
        optionID: option.optionID,
        partID: framePart.partID,
        colorID: chairPart.colorID
      });
      return option.price;
    }
  }
  console.log('Bad option or color');
  return false;
}

//Verify each part
function verifyParts(frameParts, wheelchair) {
  var chairParts = wheelchair.parts;
  var total = 0;
  for (var i = 0; i < frameParts.length; i++) {
    var chairPart = getPart(frameParts[i].partID, chairParts);
    if (!chairPart) {
      return false;
    }
    var price = verifyPart(frameParts[i], chairPart, wheelchair);
    if (!price && price === 0) {
      console.log('bad parts')
      return false;
    }
    total += price;
  }
  console.log('Parts:' + total);
  return total;
}

/***************************MEASURES***********************************/
//Finds measure with given measureID
function getMeasure(measureID, measures) {
  var measure = _.find(measures, {'measureID': measureID});
  return _.isUndefined(measure) ? false : measure;
}

//Verify a measure selection
function verifyMeasure(frameMeasure, chairMeasure, wheelchair, isInvoice) {
  var index = chairMeasure.measureOptionIndex;
  if (index === -1 && !isInvoice) {   //Measure does not need to be selected if not part of order
    wheelchair.mDetails.push({name: frameMeasure.name, selection: 'NOT SELECTED', val: '0.00'});
    return 0;
  }
  if (index >= 0 && index < frameMeasure.measureOptions[0].length) {
    wheelchair.weight += frameMeasure.weights[index];
    var selection = frameMeasure.measureOptions[0][index] + ' ' + frameMeasure.units[0] + ' / ' + frameMeasure.measureOptions[1][index] + ' ' + frameMeasure.units[1];
    var val = frameMeasure.measureOptions[0][index];
    console.log({name: frameMeasure.name, selection: selection, val: val});
    wheelchair.mDetails.push({name: frameMeasure.name, selection: selection, val: val});  //Append details to wheelchair
    return frameMeasure.prices[index];
  }
  console.log('Bad measure option');
  return false;
}

//Verify all the measures of a wheelchair
function verifyMeasures(frameMeasures, wheelchair, isInvoice) {
  var chairMeasures = wheelchair.measures;  //Client submitted measures
  if (frameMeasures.length !== chairMeasures.length) {  //Are all measures set
    console.log('Wrong number measures');
    return false;
  }
  var total = 0;
  for (var i = 0; i < frameMeasures.length; i++) {  //For each measurement for the frame
    var chairMeasure = getMeasure(frameMeasures[i].measureID, chairMeasures);
    if (!chairMeasure) {  //Is the measure set
      return false;
    }
    var price = verifyMeasure(frameMeasures[i], chairMeasure, wheelchair, isInvoice);
    if (!price && price !== 0) {  //returned value is false, but not 0
      return false;
    }
    total += price;
  }
  console.log('Measures:' + total);
  return total;
}

/******************************************************************************************/

//Verify a chair. Also add extra information to help with pdf generation
function verifyChair(wheelchair, isInvoice) {
  wheelchair.weight = 0;
  wheelchair.pDetails = [];   //More detailed part info
  wheelchair.mDetails = [];   //More detailed measurement info
  var frame = getFrame(wheelchair.frameID);
  if (frame) {                //Is the frame valid
    var partsPrice = verifyParts(frame.parts, wheelchair);
    var measuresPrice = verifyMeasures(frame.measures, wheelchair, isInvoice);
    if (partsPrice !== false && measuresPrice !== false) {  //Was parts check and measurement check successful
      //Append more wheelchair info
      wheelchair.manufacturer = frame.manufacturer;
      wheelchair.model = frame.name;
      wheelchair.price = frame.basePrice + partsPrice + measuresPrice;
      wheelchair.weight += frame.baseWeight;
      wheelchair.wheelIndex = frame.wheelIndex;
      console.log(frame.basePrice);
      console.log(partsPrice);
      console.log(measuresPrice);
      return frame.basePrice + partsPrice + measuresPrice;
    }
  }
  console.log('verify Chair');
  return false;
}

//Exported function which verifies and calculates the price for a single wheelchair
exports.verifyWheelchair = function (wheelchair) {
  var price = verifyChair(wheelchair, false);
  if(!price)
    return false;
  else
    return price;
};

//Exported function which verifies and calculates the price for an order
exports.verifyOrder = function (order) {
  var total = 0;
  for (var i = 0; i < order.wheelchairs.length; i++) {
    var price = verifyChair(order.wheelchairs[i].wheelchair, true);
    if (!price) {
      console.log('order messed up');
      return false;
    }
    total += price;
  }
  order.subtotal = total;
  order.total = total + total * 0.097 + 15 * order.wheelchairs.length;
  return order.total;
};
