'use strict';

angular.module('abacuApp')
  .factory('Part', ['Option', function (Option) {

    //##########################  Constructor  #########################
    function Part(partData) {

      this.partID          = partData.partID;
      this.name            = partData.name;
      this.numSubImages    = partData.numSubImages;
      this.zRank           = partData.zRank;
      this.defaultOptionID = partData.defaultOptionID;

      this.options = [];

      for (var i = 0; i < partData.options.length; i++)
        this.options.push(new Option(partData.options[i]));

    };


    /************instance functions**************/

    Part.prototype = {

      getID: function () { return this.partID; },
      getName: function () { return this.name; },
      getNumSubImages: function () { return this.numSubImages; },
      getZRank: function () { return this.zRank; },
      getDefaultOptionID: function () { return this.defaultOptionID; },
      getOptions: function () { return this.options; },
      getNumOptions: function () { return this.options.length; },



      getDefaultOption: function () {
        return this.getOption(this.defaultOptionID); //TODO: does this work? If not - how can we do this?
      },

      getZRankForAngle: function (angle) {
        if (angle >= 0 && angle < zRank.length)
          return this.zRank[angle];
        return 0;
      }

    };




    //Don't touch this
    return (Part);
  }]);
