// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.service:userService
 * @description
 * # userService
 * Service of the abacuApp
 */
angular.module('abacuApp')
  .service('FrameData', ['Frame', function (Frame) {

    //An array of Frame objects
    this.frames = initializeFrames();


    //Initialize the frameData (pull from JSON)
    var initializeFrames = function () {
      var frameData = frameDataFromDB; //TODO: Put DbLoad.js calls in here?
      var myFrames = [];

      for (var i = 0; i < frameData.length; i++) {
        myFrames.push(new Frame(frameData[i]));
      }

      return myFrames;
    };

    //Get the Frame with the given ID
    this.getFrame = function (fID) {
      for (var i = 0; i < this.frames.length; i++) {
        var curFrame = this.frames[i];
        if (curFrame.getFrameID() === fID) {
          return curFrame;
        }
      }
      return null;
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