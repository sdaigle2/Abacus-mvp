'use strict';

/*
* This factory produces Measure objects
* Measure is part of the FrameData model tree
* Measure contains it own array of options as well as the names of the option's units, prices, and weights
* EXAMPLE:
* options = [['a', 'b', 'c'], ['A', 'B', 'C']]
* units = ['lowercase', 'uppercase']
* prices = [1, 2, 3]
* weights = [0.1, 0.2, 0.3]
*/

angular.module('abacuApp')
  .factory('Measure', [function () {

    //##########################  Constructor  #########################
    function Measure(measureData) {

      this.measureID = measureData.measureID;
      this.measureOptions = measureData.measureOptions;
      this.weights = measureData.weights;
      this.prices = measureData.prices;

      this.name = measureData.name;
      this.desc = measureData.desc;
      this.details = measureData.details;
      this.tip = measureData.tip;
      this.units = measureData.units;
      this.videoURL = measureData.videoURL;
      this.imageURLs = measureData.imageURLs;
      this.gifURL = measureData.gifURL;
      this.comments = measureData.comments;
    };


    /************instance functions**************/

    Measure.prototype = {

      getID: function () { return this.measureID; },
      getOptions: function () { return this.measureOptions; },
      getName: function () { return this.name; },
      getDesc: function () { return this.desc; },
      getDetails: function () { return this.details; },
      getTip: function () { return this.tip; },
      getWeights: function () { return this.weights; },
      getPrices: function () { return this.prices; },
      getUnits: function (system) { return this.units[system]; }, //Expects a Units.unitSys enum value
      getVideoURL: function () { return this.videoURL; },
      getGifURL: function () { return this.gifURL; },
      getImageURLs: function () { return this.imageURLs; },
      getNumImages: function () { return this.imageURLs.length; },
      getImageURL: function (index) { return this.imageURLs[index]; },
      getComments: function(){return this.comments},

      getOption: function (unitSys, index) {
        console.log("get option function")
        if (index >= 0 && index < this.measureOptions[unitSys].length) {
          return this.measureOptions[unitSys][index];
        }
        return '';
      },

      getWeight: function (index) {
        if (index >= 0 && index < this.weights.length)
          return this.weights[index];
        return 0;
      },

      getPrice: function (index) {
        if (index >= 0 && index < this.prices.length)
          return this.prices[index];
        return 0;
      }

    };




    //Don't touch this
    return (Measure);
  }]);
