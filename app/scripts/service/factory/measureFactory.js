'use strict';

angular.module('abacuApp')
  .factory('Measure', ['syncJSON', function (syncJSON) {

    //##########################  Constructor  #########################
    function Measure(measureData) {

      this.measureID = measureData.measureID;
      this.measureOptions = measureData.measureOptions;

      this.name = '';
      this.desc = '';
      this.details = '';
      this.tip = '';
      this.units = [];
      this.videoURL = '';
      this.imageURLs = [];
      this.gifURL = '';

      var json = syncJSON.loadJSON('data/measureData.json');
      for (var i = 0; i < json.length; i++) {
        var curMes = json[i];
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
      getUnits: function (system) { return this.units[system]; },
      getVideoURL: function () { return this.videoURL; },
      getGifURL: function () { return this.gifURL; },
      getImageURLs: function () { return this.imageURLs; },
      getNumImages: function () { return this.imageURLs.length; },
      getImageURL: function (index) { return this.imageURLs[index]; },

      getOption: function (index) {
        if (index >= 0 && index < this.measureOptions.length) {
          return this.measureOptions[index];
        }
        return '';
      }

    };




    //Don't touch this
    return (Measure);
  }]);
