'use strict';

angular.module('abacuApp')
  .factory('Frame', [function () {

    //##########################  Constructor  #########################
    function Frame ( _id ) {
      var id = _id;
      this.manufacturer;
      this.name;
      this.desc;
      this.basePrice;
      this.baseWeight;
      this.imageURL;
      this.parts;
    }

    //#######################  Instance methods  ##########################
    Frame.prototype = {

      // load from database
      load : function () {
        $http.get('/data/frameData.json').
          success(function(data) {
            var frameData = data;

            for (var frameIndex = 0; frameIndex < frameData.length; frameIndex++) {
              if (frameData[frameIndex].frameID === id) {
                this.manufacturer = frameData[frameIndex]["manufacturer"];
                this.name = frameData[frameIndex]["name"];
                this.desc = frameData[frameIndex]["desc"];
                this.basePrice = frameData[frameIndex]["basePrice"];
                this.baseWeight = frameData[frameIndex]["baseWeight"];
                this.imageURL = frameData[frameIndex]["imageURL"];
                this.parts = [];

                for (var partIndex=0; partIndex < frameData[frameIndex]["parts"].length; partIndex++) {
                  var partID = frameData[frameIndex]["parts"][partIndex]["id"];
                  this.parts[partIndex] = new Part(partID);

                }

              }
            }

          }).
          error(function() {
            throw "Error Loading Frame from Database";
          });
      },


      // save to database
      save : function () {



      },




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

