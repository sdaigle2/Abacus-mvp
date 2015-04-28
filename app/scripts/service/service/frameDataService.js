// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.service:frameDataService
 * @description
 * # frameDataService
 * Service of the abacuApp
 */
angular.module('abacuApp')
  .service('FrameData', ['Frame', function (Frame) {

    //Initialize the frameData (pull from JSON)
    function initializeFrames () {
      $.getJSON('data/frameDataNew.json')
        .done(function (json) {
          var frameData = json;
          var myFrames = [];

          for (var i = 0; i < frameData.length; i++) {
            myFrames.push(new Frame(frameData[i]));
          }

          alert("MyFrames: " + JSON.stringify(myFrames));

          return myFrames;
        })
        .fail(function (jqxhr, textStatus, error) {
          var err = textStatus + ', ' + error;
          console.log('Request Failed: ' + err);
          return null;
        });
    };

    //An array of Frame objects
    this.frames = initializeFrames();

    //Get the Frame with the given ID
    this.getFrame = function (fID) {
      for (var i = 0; i < this.frames.length; i++) {
        var curFrame = this.frames[i];
        if (curFrame.getID() === fID) {
          return curFrame;
        }
      }
      return null;
    };

    //Get the frame with the given name
    this.getFrameByName = function (fName) {
      for (var i = 0; i < this.frames.length; i++) {
        var curFrame = this.frames[i];
        if (curFrame.getName() === fName) {
          return curFrame;
        }
      }
      return null;
    };

    this.getFrameByIndex = function (index) {
      if (index >= 0 && index < this.frames.length)
        return this.frames[index];
      return null;
    };

    //Get the number of frames currently being tracked
    this.getNumFrames = function () { return this.frames.length; };

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