/**
 * Created by Dhruv on 7/7/2015.
 */
var frameData = require('./app/data/frameData.json');

function getFrame(frameID){
  for(var i=0; i<frameData.length; i++){
    if(frameData[i].frameID === frameID){
      return frameData[i];
    }
  }
  return false;
}

function getPart(partID, parts){
  for(var i=0; i<parts.length; i++){
    if(parts[i].partID === partID){
      return parts[i];
    }
  }
  return false;
}

function getOption(optionID, options){
  for(var i=0; i<options.length; i++){
    if(options[i].optionID === optionID){
      return options[i];
    }
  }
  return false;
}

function verifyColor(colorID, colors){
  for(var i=0; i<colors.length; i++){
    if(colors[i].colorID === colorID){
      return true;
    }
  }
  if(colors.length === 0 && colorID === 0)
    return true;
  return false;
}

function verifyPart(framePart, chairPart, wheelchair){
  var option = getOption(chairPart.optionID, framePart.options);
  if(option){
    if(verifyColor(chairPart.colorID, option.colors)) {
      wheelchair.weight += option.weight;
      wheelchair.pDetails.push({name: framePart.name, option: option.name, price: option.price});
      return option.price;
    }
  }
  return false;
}

function verifyParts(frameParts, wheelchair){
  var chairParts = wheelchair.parts;
  if(frameParts.length !== chairParts.length){
    return false;
  }
  var total = 0;
  for(var i=0; i<frameParts.length; i++){
    var chairPart = getPart(frameParts[i].partID, chairParts);
    if(!chairPart){
      return false;
    }
    var price = verifyPart(frameParts[i], chairPart, wheelchair);
    if(!price && price!==0) {
      return false;
    }
    total += price;
  }
  console.log('Parts:'+total);
  return total;
}

function getMeasure(measureID, measures){
  for(var i=0; i<measures.length; i++){
    if(measures[i].measureID === measureID){
      return measures[i];
    }
  }
  return false;
}

function verifyMeasure(frameMeasure, chairMeasure, wheelchair){
  var index = chairMeasure.measureOptionIndex;
  if(index >= 0 && index < frameMeasure.measureOptions[0].length) {
    wheelchair.weight += frameMeasure.weights[index];
    var selection = frameMeasure.measureOptions[0][index]+' '+frameMeasure.units[0]+' / '+frameMeasure.measureOptions[1][index]+' '+frameMeasure.units[1];
    wheelchair.mDetails.push({name: frameMeasure.name, selection: selection});
    return frameMeasure.prices[index];
  }
  return false;
}

function verifyMeasures(frameMeasures, wheelchair){
  var chairMeasures = wheelchair.measures;
  if(frameMeasures.length !== chairMeasures.length){
    return false;
  }
  var total = 0;
  for(var i=0; i<frameMeasures.length; i++){
    var chairMeasure = getMeasure(frameMeasures[i].measureID, chairMeasures);
    if(!chairMeasure){
      return false;
    }
    var price = verifyMeasure(frameMeasures[i], chairMeasure, wheelchair);
    if(!price && price!==0) {
      return false;
    }
    total += price;
  }
  console.log('Measures:'+total);
  return total;
}

function verifyChair(wheelchair){
  wheelchair.weight = 0;
  wheelchair.pDetails = [];
  wheelchair.mDetails = [];
  var frame = getFrame(wheelchair.frameID);
  if(frame){
    var partsPrice = verifyParts(frame.parts, wheelchair);
    var measuresPrice = verifyMeasures(frame.measures, wheelchair);
    if(partsPrice!==false && measuresPrice!==false) {
      wheelchair.manufacturer = frame.manufacturer;
      wheelchair.model = frame.name;
      wheelchair.price = frame.basePrice + partsPrice + measuresPrice;
      wheelchair.weight += frame.baseWeight;
      wheelchair.wheelIndex = frame.wheelIndex;
      return frame.basePrice + partsPrice + measuresPrice;
    }
  }
  return false;
}

exports.verifyOrder = function(order){
  var total = 0;
  for(var i=0; i<order.wheelchairs.length; i++){
    var price = verifyChair(order.wheelchairs[i]);
    if(!price)
      return false;
    total += price;
  }
  order.subtotal = total;
  order.total = total + total*0.097 + 15*order.wheelchairs.length;
  return order.total;
};
