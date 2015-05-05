'use strict';

angular.module('abacuApp')
  .factory('Wheelchair', [function () {

    //##########################  Constructor  #########################
    function Wheelchair ( frameID ) {
      this.frameID = frameID;
      this.parts = [];
      this.measures = [];
      //TODO: construct parts and measures from frameID
    }

    //#######################  Instance methods  ##########################
    Wheelchair.prototype = {

      //Calculate Total Weight
      getTotalWeight: function () {
        //TODO: Replace function once FrameData Service created
        return 0;
      },

      //Calculate total Price
      getTotalPrice: function () {
        //TODO: Replace function once FrameData Service created
        return 0;
      },

      //Returns true if all measurements have a selected option
      allMeasuresSet: function () {
        for (var i = 0; i < this.measures.length; i++) {
          if (this.measures[i].measureOptionIndex === -1) {
            return false;
          }
        }
        return true;
      }

      //TODO: Get/Sets

      //TODO: Image generation

    };

    //################## Static Methods  #########################




    //Don't touch this
    return (Wheelchair);
  }]);



/*
curWheelchair = {
  frameID
  parts[] = {partID, optionID, colorID}
  measures[] = {measureID, measureOptionIndex}
}


*/

