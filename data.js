/**
 * Created by Dhruv on 7/7/2015.
 */
var frameData = require('./app/data/frameData.json');

function getFrame(frameID) {
  for (var i = 0; i < frameData.length; i++) {
    if (frameData[i].frameID === frameID) {
      return frameData[i];
    }
  }
  console.log('Bad frame Id');
  return false;
}

function getPart(partID, parts) {
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].partID === partID) {
      return parts[i];
    }
  }
  console.log('Bad part ID');
  return false;
}

function getOption(optionID, options) {
  for (var i = 0; i < options.length; i++) {
    if (options[i].optionID === optionID) {
      return options[i];
    }
  }
  console.log('Bad option ID');
  return false;
}

function verifySize(index, sizes) {
  if (index >= 0 && index < sizes.length)
    return sizes[index];
  return sizes.length === 0 && index === -1;
}

function verifyColor(colorID, colors) {
  if (colors) {
    for (var i = 0; i < colors.length; i++) {
      if (colors[i].colorID === colorID) {
        return colors[i].hex;
      }
    }
  }
  return (!colors || colors.length === 0) && colorID === 0;
}

function verifyPart(framePart, chairPart, wheelchair) {
  var option = getOption(chairPart.optionID, framePart.options);
  if (option) {
    var size = verifySize(chairPart.sizeIndex, option.sizes);
    var hex = verifyColor(chairPart.colorID, option.colors);
    if (hex && size) {
      wheelchair.weight += option.weight;
      wheelchair.pDetails.push({
        name: framePart.name,
        option: option.name,
        color: hex,
        size: size,
        price: option.price,
        zRank: framePart.zRank,
        numSubImages: framePart.numSubImages,
        onFrame: framePart.onFrame
      });
      return option.price;
    }
  }
  console.log('Bad option or color');
  return false;
}

function verifyParts(frameParts, wheelchair) {
  var chairParts = wheelchair.parts;
  if (frameParts.length !== chairParts.length) {
    console.log('Number of parts wrong');
    return false;
  }
  var total = 0;
  for (var i = 0; i < frameParts.length; i++) {
    var chairPart = getPart(frameParts[i].partID, chairParts);
    if (!chairPart) {
      return false;
    }
    var price = verifyPart(frameParts[i], chairPart, wheelchair);
    if (!price && price !== 0) {
      return false;
    }
    total += price;
  }
  console.log('Parts:' + total);
  return total;
}

function getMeasure(measureID, measures) {
  for (var i = 0; i < measures.length; i++) {
    if (measures[i].measureID === measureID) {
      return measures[i];
    }
  }
  console.log('Bad measure');
  return false;
}

function verifyMeasure(frameMeasure, chairMeasure, wheelchair, isInvoice) {
  var index = chairMeasure.measureOptionIndex;
  if (index === -1 && !isInvoice) {
    wheelchair.mDetails.push({name: frameMeasure.name, selection: 'NOT SELECTED', val: '0.00'});
    return 0;
  }
  if (index >= 0 && index < frameMeasure.measureOptions[0].length) {
    wheelchair.weight += frameMeasure.weights[index];
    var selection = frameMeasure.measureOptions[0][index] + ' ' + frameMeasure.units[0] + ' / ' + frameMeasure.measureOptions[1][index] + ' ' + frameMeasure.units[1];
    var val = frameMeasure.measureOptions[0][index];
    console.log({name: frameMeasure.name, selection: selection, val: val});
    wheelchair.mDetails.push({name: frameMeasure.name, selection: selection, val: val});
    return frameMeasure.prices[index];
  }
  console.log('Bad measure option');
  return false;
}

function verifyMeasures(frameMeasures, wheelchair, isInvoice) {
  var chairMeasures = wheelchair.measures;
  if (frameMeasures.length !== chairMeasures.length) {
    console.log('Wrong number measures');
    return false;
  }
  var total = 0;
  for (var i = 0; i < frameMeasures.length; i++) {
    var chairMeasure = getMeasure(frameMeasures[i].measureID, chairMeasures);
    if (!chairMeasure) {
      console.log('getMeasure');
      return false;
    }
    var price = verifyMeasure(frameMeasures[i], chairMeasure, wheelchair, isInvoice);
    if (!price && price !== 0) {
      console.log('verifyMeasure');
      return false;
    }
    total += price;
  }
  console.log('Measures:' + total);
  return total;
}

function verifyChair(wheelchair, isInvoice) {
  wheelchair.weight = 0;
  wheelchair.pDetails = [];
  wheelchair.mDetails = [];
  var frame = getFrame(wheelchair.frameID);
  if (frame) {
    var partsPrice = verifyParts(frame.parts, wheelchair);
    var measuresPrice = verifyMeasures(frame.measures, wheelchair, isInvoice);
    if (partsPrice !== false && measuresPrice !== false) {
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

exports.verifyWheelchair = function (wheelchair) {
  var price = verifyChair(wheelchair, false);
  if(!price)
    return false;
  else
    return price;
};

exports.verifyOrder = function (order) {
  var total = 0;
  for (var i = 0; i < order.wheelchairs.length; i++) {
    var price = verifyChair(order.wheelchairs[i], true);
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
