'use strict';

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

      getColorID: function () {
        return this.colorID;
      },

      getName: function () {
        return this.name;
      },

      getHexString: function () {
        return this.hex;
      },

      getHexValue: function () {
        return parseInt(this.hex.replace('#', '0x'));
      }
    };




    //Don't touch this
    return (Color);
  }]);
