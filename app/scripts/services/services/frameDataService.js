'use strict';

/**
 * @ngdoc function
 * @name abacuApp.services:frameDataService
 * @description
 * # frameDataService
 * Service of the abacuApp
 */

/*
* The FrameData service acts as the root to a forest (set of trees) of Frames
* FrameData loads in all frame-related data from the database when the page loads
* The data in FrameData should not be modified, only accessed
*/
angular.module('abacuApp')
  .service('FrameData', ['Frame', 'syncJSON', function (Frame, syncJSON) {

    //Load in data from database
    var frames = [];
    var frameData = syncJSON.loadJSON('data/frameData.json');
    for (var i = 0; i < frameData.length; i++) {
      frames.push(new Frame(frameData[i]));
    }

    console.log(frames);

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

      getNumFrames: function () { return frames.length; },

      //Multi-level functions
      getFramePart: function (fID, pID) {
        return this.getFrame(fID).getPart(pID);
      },

      getFramePartOption: function (fID, pID, oID) {
        return this.getFramePart(fID, pID).getOption(oID);
        //     this.getFrame(fID).getPartOption(pID, oID);
        //     this.getFrame(fID).getPart(pID).getOption(oID);
      },

      getFramePartOptionColor: function (fID, pID, oID, cID) {
        return this.getFramePartOption(fID, pID, oID).getColor(cID);
        //     this.getFramePart(fID, pID).getOptionColor(oID, cID);
        //     this.getFramePart(fID, pID).getOption(oID).getColor(cID);
        //     this.getFrame(fID).getPartOptionColor(pID, oID, cID);
        //     this.getFrame(fID).getPartOption(pID, oID).getColor(cID);
        //     this.getFrame(fID).getPart(pID).getOptionColor(oID, cID);
        //     this.getFrame(fID).getPart(pID).getOption(oID).getColor(cID);
      },

      getFrameMeasure: function (fID, mID) {
        return this.getFrame(fID).getMeasure(mID);
      },

      getFrameMeasureOption: function (fID, mID, oIndex) {
        return this.getFrame(fID).getMeasureOption(mID, oIndex);
      }

    };


  }]);


/*
This is what FrameData looks like when it is fully constructed:

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
