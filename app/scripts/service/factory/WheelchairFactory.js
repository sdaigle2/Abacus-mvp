'use strict';

angular.module('abacuApp')
  .factory('Wheelchair', ['FrameData', 'option' function (FrameData, option ) {

    //##########################  Constructor  #########################
    var curFrame = FrameData.getFrame(frameID);
    function Wheelchair ( frameID, title ) {
      //TODO: how to verify if we are build a new design or we are loading the old ones according to current cart index?
      this.frameID = frameID;
      this.parts = [];
      this.measures = [];
      this.title = title;
      this.calcPrice = -1;
      this.calcWeight = -1;
      for (var i = 0; i < curFrame.parts.length; i++){
        var curPart = curFrame.parts[i];
        this.parts.push({
          partID: curPart.partID,
          optionID: curPart.defaultOptionID,
          colorID: option.getoption(curPart.defaultOptionID).defaultColorID,
          weight: option.getoption(curPart.defaultOptionID).weight,
          price: option.getoption(curPart.defaultOptionID).price
        });
      }

      for (var j=0; j < curFrame.measures.length; i++){
        this.measures.push({
          measureID: curFrame.measures[j].measureID,
          measureOptionIndex: -1
        })
      }
    }

    //#######################  Instance methods  ##########################
    Wheelchair.prototype = {
      resetCurWheelchair:function(){

      },

      //Calculate Total Weight
      getTotalWeight: function () {
        var totalWeight = curFrame.baseWeight;
        for (var i = 0; i < this.parts.length; i++) {
          totalWeight += this.parts[i].price;
        }
        for (var j = 0; j < this.parts.length; j++) {
          if (this.measures[j].measureOptionIndex !== -1) {
            totalWeight += this.measures.weight[this.measures[j].measureOptionIndex];
          }
        }

        return totalWeight;
      },
        //Calculate total Price
      getTotalPrice: function () {
        var totalPrice = curFrame.basePrice;
        for (var i = 0; i < this.parts.length; i++){
          totalPrice += this.parts[i].price;
        }
        for (var j = 0; j < this.parts.length; j++){
          if(this.measures[j].measureOptionIndex !== -1){
            totalPrice += this.measures.price[this.measures[j].measureOptionIndex];
          }
        }

        return totalPrice;
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

