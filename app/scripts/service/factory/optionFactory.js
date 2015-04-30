'use strict';

angular.module('abacuApp')
  .factory('Option', ['Color', 'syncJSON', function (Color, syncJSON) {

    //##########################  Constructor  #########################
    function Option(optionData) {

      this.optionID = optionData.optionID;
      this.price = optionData.price;

      this.name = '';
      this.thumbnailURL = '';
      this.desc = '';
      this.weight = 0;
      this.defaultColorID = optionData.defaultColorID;

      var json = syncJSON.loadJSON('data/optionData.json')
      for (var i = 0; i < json.length; i++) {
        var curOp = json[i];
        if (curOp.optionID === this.optionID) {
          this.name = curOp.name;
          this.thumbnailURL = curOp.thumbnailURL;
          this.desc = curOp.desc;
          this.weight = curOp.weight;
        }
      }

      this.colors = [];

      for (var i = 0; i < optionData.colors.length; i++)
        this.colors.push(new Color(optionData.colors[i]));

    };


    /************instance functions**************/

    Option.prototype = {

      getID: function () { return this.optionID; },
      getName: function () { return this.name; },
      getPrice: function () { return this.price; },
      getWeight: function () { return this.weight; },
      getThumbnailURL: function () { return this.thumbnailURL; },
      getDefaultColorID: function () { return this.defaultColorID; },
      getColors: function () { return this.colors; },
      getNumColors: function () { return this.colors.length; },

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
      }

    };




    //Don't touch this
    return (Option);
  }]);
