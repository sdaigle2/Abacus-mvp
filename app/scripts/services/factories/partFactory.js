'use strict';

/*
* This factory produces Part objects
* Part is part of the FrameData model tree
* Each Frame has an array of at least one Part
* Each Part has an array of at least one Option
* Part contains numSubImages and zRank, which are used by PreviewImage
*/
angular.module('abacuApp')
  .factory('Part', ['Option', 'syncJSON', function (Option) {

    //##########################  Constructor  #########################
    function Part(partData) {
      
      this.partID               = partData.partID;
      this.name                 = partData.name;
      this.numSubImages         = partData.numSubImages;
      this.zRank                = partData.zRank;
      this.defaultOptionID      = partData.defaultOptionID;
      this.iconImage            = partData.iconImage;
      this.allowMultipleChoices = partData.allowMultipleChoices;

      this.options = [];
      if(!this.zRank){
        this.zRank = [];
      }
      console.log("Part constructor")
      for (var i = 0; i < partData.options.length; i++){
        if(partData.options[i].hidden === undefined && partData.options[i].hidden !== false)
          this.options.push(new Option(partData.options[i]));
      }
        
    }


    /************instance functions**************/

    Part.prototype = {

      getID: function () { return this.partID; },
      getName: function () { return this.name; },
      getIconImage: function() {return this.iconImage},
      getNumSubImages: function () { return this.numSubImages; },
      getZRanks: function () { return this.zRank; },
      getDefaultOptionID: function () { return this.defaultOptionID; },
      getOptions: function () {
        console.log("get options")
         return this.options; 
        },
      getNumOptions: function () { return this.options.length; },

      getOption: function (opID) {
        console.log("get option function")
        for (var i = 0; i < this.options.length; i++){
          // console.log(this.options[i])
          // console.log(this.options[i].name, this.options[i].hidden)
          if(this.options[i].hidden === undefined && this.options[i].hidden !== false){
            if (this.options[i].getID() === opID) {
              return this.options[i];
              break;
              }
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
