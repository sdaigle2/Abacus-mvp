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

      getFrameID: function () {
        return this.frameID;
      }

    };

    //################## Static Methods  #########################




    //Don't touch this
    return (Frame);
  }]);



