'use strict';

angular.module('abacuApp')
  .factory('Measure', [function () {

    //##########################  Constructor  #########################
    function Measure(measureData) {

      this.measureID = measureData.measureID;
      this.measureOptions = measureData.measureOptions;

      //TODO: load remaining measure data from measureData.json using measureID


    };


    /************instance functions**************/

    Measure.prototype = {

    };




    //Don't touch this
    return (Measure);
  }]);
