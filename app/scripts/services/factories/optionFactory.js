'use strict';

/*
* This factory creates Option objects
* Option is part of the FrameData model tree
* Each Part has an array containing at least one Option
* Each Option has an array of 0 or more Colors
*/

angular.module('abacuApp')
  .factory('Option', ['Color', function (Color) {

    //##########################  Constructor  #########################
    function Option(optionData) {

      this.optionID = optionData.optionID;
      this.price = optionData.price;

      this.name = optionData.name;
      this.thumbnailURL = optionData.thumbnailURL;
      this.desc = optionData.desc;
      this.weight = optionData.weight;
      this.defaultColorID = optionData.defaultColorID;
      this.sizes = optionData.sizes;
      this.defaultSizeIndex = optionData.defaultSizeIndex;


      this.colors = [];

      if(optionData.colors) {
        for (var i = 0; i < optionData.colors.length; i++)
          this.colors.push(new Color(optionData.colors[i]));
      }
      else
        this.defaultColorID = 0;

    };


    /************instance functions**************/

    Option.prototype = {

      getID: function () { return this.optionID; },
      getName: function () { return this.name; },
      getPrice: function () { return this.price; },
      getWeight: function () { return this.weight; },
      getDesc: function () { return this.desc; },
      getThumbnailURL: function () { return this.thumbnailURL; },
      getDefaultColorID: function () { return this.defaultColorID; },
      getDefaultSizeIndex: function () { return this.defaultSizeIndex},
      getSizes: function () { return this.sizes},
      getColors: function () { return this.colors; },
      getNumSizes: function () { return this.sizes.length},
      getNumColors: function () { return this.colors.length; },

      getSize: function (index) {
        if(index >= 0 && index < this.sizes.length)
          return this.sizes[index];
      },

      getColor: function (colID) {
        for (var i = 0; i < this.colors.length; i++)
          if (this.colors[i].getID() === colID)
            return this.colors[i];
        return null;
      },

      getColorByName: function (colName) {
        for (var i = 0; i < this.colors.length; i++)
          if (this.colors[i].getName() === colName)
            return this.colors[i];
        return null;
      },

      getColorByIndex: function (index) {
        if (index >= 0 && index < this.colors.length)
          return this.colors[i];
        return null;
      },

      getDefaultColor: function () {
        return this.getColor(this.defaultColorID);
      },

      getDefaultSize: function () {
        return this.getSize(this.defaultSizeIndex);
      }

    };




    //Don't touch this
    return (Option);
  }]);
