'use strict';

angular.module('abacuApp')
  .factory('Option', ['Color', function (Color) {

    //##########################  Constructor  #########################
    function Option(optionData) {

      this.optionID = optionData.optionID;
      this.price = optionData.price;

      //TODO: load remaining option data from optionData.json using optionID

      this.colors = [];

      for (var i = 0; i < optionData.colors.length; i++)
        this.colors.push(new Color(optionData.colors[i]));

    };


    /************instance functions**************/

    Option.prototype = {

    };




    //Don't touch this
    return (Option);
  }]);
