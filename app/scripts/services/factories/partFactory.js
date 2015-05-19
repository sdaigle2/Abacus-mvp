'use strict';

/*
* This factory produces Part objects
* Part is part of the FrameData model tree
* Each Frame has an array of at least one Part
* Each Part has an array of at least one Option
* Part contains numSubImages and zRank, which are used by PreviewImage
*/
angular.module('abacuApp')
  .factory('Part', ['Option', 'syncJSON', function (Option, syncJSON) {

    //##########################  Constructor  #########################
    function Part(partData) {

      this.partID          = partData.partID;
      this.name            = partData.name;
      this.numSubImages    = partData.numSubImages;
      this.zRank           = partData.zRank;
      this.defaultOptionID = partData.defaultOptionID;

      this.options = [];

      var optionJSON = syncJSON.loadJSON('data/optionData.json');
      for (var i = 0; i < partData.options.length; i++)
        this.options.push(new Option(partData.options[i], optionJSON));

    };


    /************instance functions**************/

    Part.prototype = {

      getID: function () { return this.partID; },
      getName: function () { return this.name; },
      getNumSubImages: function () { return this.numSubImages; },
      getZRanks: function () { return this.zRank; },
      getDefaultOptionID: function () { return this.defaultOptionID; },
      getOptions: function () { return this.options; },
      getNumOptions: function () { return this.options.length; },

      getOption: function (opID) {
        for (var i = 0; i < this.options.length; i++){
          if (this.options[i].getID() === opID) {
            return this.options[i];
            break;
            }
          }
        return null;
      },

      getOptionByIndex: function (index) {
        if (index >= 0 && index < this.options.length)
          return this.options[index];
        return null;
      },

      getOptionByName: function (oName) {
        for (var i = 0; i < this.options.length; i++)
          if (this.options[i].getName() === oName)
            return this.options[i];
        return null;
      },


      getDefaultOption: function () {
        return this.getOption(this.defaultOptionID);
      },

      getZRank: function (subImageIndex, angle) {
        if (subImageIndex >= 0 && subImageIndex < this.zRank.length)
          if (angle >= 0 && angle < this.zRank[subImageIndex].length)
            return this.zRank[subImageIndex][angle];
        return 0;
      },

      //Multi-level functions
      getOptionColor: function (oID, cID) {
        return this.getOption(oID).getColor(cID);
      }

    };




    //Don't touch this
    return (Part);
  }]);
