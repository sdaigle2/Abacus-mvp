'use strict';

/*
* This Factory creates a Color object
* A Color object is part of the FrameData model tree
* A Color has a name and a hex value
*/


angular.module('abacuApp')
  .factory('Color', [function () {

    //##########################  Constructor  #########################
    function Color(colorData) {

      this.colorID = colorData.colorID;
      this.name = colorData.name;
      this.hex = colorData.hex;

    };


    /************instance functions**************/

    Color.prototype = {

      getID: function () { return this.colorID; },
      getName: function () { return this.name; },

      //Returns the color's hex value as a CSS friendly string
      getHexString: function () {
        return this.hex;
      },

      //Returns the color's hex value as a javascript hex value
      getHexValue: function () {
        return parseInt(this.hex.replace('#', '0x'));
      }
    };




    //Don't touch this
    return (Color);
  }]);
