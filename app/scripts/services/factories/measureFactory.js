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
    function Measure(measureData, jsonData) {

      this.measureID = measureData.measureID;
      this.measureOptions = measureData.measureOptions;
      this.weights = measureData.weights;
      this.prices = measureData.prices;

      this.name = '';
      this.desc = '';
      this.details = '';
      this.tip = '';
      this.units = [];
      this.videoURL = '';
      this.imageURLs = [];
      this.gifURL = '';

      for (var i = 0; i < jsonData.length; i++) {
        var curMes = jsonData[i];
        if (curMes.measureID === this.measureID) {
          this.name = curMes.name;
          this.desc = curMes.desc;
          this.details = curMes.details;
          this.tip = curMes.tip;
          this.units = curMes.units;
          this.videoURL = curMes.videoURL;
          this.imageURLs = curMes.imageURLs;
          this.gifURL = curMes.gifURL;
          break;
        }
      }
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

      getOption: function (unitSys, index) {
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
