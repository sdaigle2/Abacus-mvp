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

    };




    //Don't touch this
    return (Part);
  }]);
