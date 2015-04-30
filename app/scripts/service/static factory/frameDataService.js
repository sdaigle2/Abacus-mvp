// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static factory:frameDataService
 * @description
 * # frameDataService
 * Service of the abacuApp
 */
angular.module('abacuApp')
  .service('FrameData', ['Frame', 'syncJSON', function (Frame, syncJSON) {

    var frames = [];
    var frameData = syncJSON.loadJSON('data/frameDataNew.json');
    for (var i = 0; i < frameData.length; i++) {
      frames.push(new Frame(frameData[i]));
    }

    return {

      getFrames: function () {
        return frames;
      },

      getFrame: function (fID) {
        for (var i = 0; i < frames.length; i++) {
          var curFrame = frames[i];
          if (curFrame.getID() === fID) {
            return curFrame;
          }
        }
        return null;
      },

      getFrameByName: function (fName) {
        for (var i = 0; i < this.frames.length; i++) {
          var curFrame = frames[i];
          if (curFrame.getName() === fName) {
            return curFrame;
          }
        }
        return null;
      },

      getFrameByIndex: function (index) {
        if (index >= 0 && index < frames.length)
          return frames[index];
        return null;
      },

      getNumFrames: function () { return frames.length; }

    };


  }]);


/*
this.data = [{
  frameID
  name
  manufacturer
  desc
  imageURL
  basePrice
  baseWeight
  parts[{}]
  measures[{}]
}]

this.data.parts = [{
  partID
  name
  defaultOptionID
  numSubImages
  zRank[int]
  options[{}]
}]

this.data.parts.options = [{
  optionID
  name
  desc
  price
  weight
  thumbnailURL
  defaultColorID
  colors[{}]
}]

this.data.parts.options.colors = [{
  colorID
  name
  hex
}]

this.data.measures = [{
  measureID
  name
  desc
  details
  tip
  measureOptions[[String]]
  units[String]
  weights[Float]
  prices[Float]
  imageURLs[String]
  videoURL
  gifURL
}]
*/
