'use strict';

angular.module('abacuApp')
  .factory('Frame', ['Part', 'Measure', function (Part, Measure) {

    //##########################  Constructor  #########################
    function Frame(frameData) {

      this.frameID      = frameData.frameID;
      this.manufacturer = frameData.manufacturer;
      this.name         = frameData.name;
      this.desc         = frameData.desc;
      this.basePrice    = frameData.basePrice;
      this.baseWeight   = frameData.baseWeight;
      this.imageURL     = frameData.imageURL;

      this.parts = [];
      this.measures = [];

      for (var i = 0; i < frameData.parts.length; i++)
        this.parts.push(new Part(frameData.parts[i]));

      for (var i = 0; i < frameData.measures.length; i++)
        this.measures.push(new Measure(frameData.measures[i]));
    };

    //#######################  Instance methods  ##########################
    Frame.prototype = {

      getID: function () { return this.frameID; },
      getName: function () { return this.name; },
      getManufacturer: function () { return this.manufacturer; },
      getDesc: function () { return this.desc; },
      getBasePrice: function () { return this.basePrice; },
      getBaseWeight: function () { return this.baseWeight; },
      getImageURL: function () { return this.imageURL; },
      getParts: function () { return this.parts; },
      getMeasures: function () { return this.measures; },
      getNumParts: function () { return this.parts.length; },
      getNumMeasures: function () { return this.measures.length; },

      getPart: function (pID) {
        for (var i = 0; i < this.parts.length; i++)
          if (this.parts[i].getID() === pID)
            return this.parts[i];
        return null;
      },

      getPartByName: function (pName) {
        for (var i = 0; i < this.parts.length; i++)
          if (this.parts[i].getName() === pName)
            return this.parts[i];
        return null;
      },

      getPartByIndex: function (index) {
        if (index >= 0 && index < this.parts.length)
          return this.parts[index];
        return null;
      },

      getMeasure: function (mID) {
        for (var i = 0; i < this.measures.length; i++)
          if (this.measures[i].getID() === mID)
            return this.measures[i];
        return null;
      },

      getMeasureByName: function (mName) {
        for (var i = 0; i < this.measures.length; i++)
          if (this.measures[i].getName() === mName)
            return this.measures[i];
        return null;
      },

      getMeasureByIndex: function (index) {
        if (index >= 0 && index < this.measures.length)
          return this.measures[index];
        return null;
      },

      //Silly extra functions
      getPartOption: function (partID, optionID) {
        return this.getPart(partID).getOption(optionID); //TODO: Does this work?
      },

      getPartOptionColor: function (partID, optionID, colorID) {
        return this.getOption(partID, optionID).getColor(colorID); //TODO: Does this work?
      },

      getMeasureOption: function (measureID, optionIndex) {
        return this.getMeasure(measureID).getOption(optionIndex); //TODO: Does this work?
      }
    };

    //################## Static Methods  #########################




    //Don't touch this
    return (Frame);
  }]);



