'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static factory:unitService
 * @description
 * # unitService
 * Service of the abacuApp
 */
angular.module('abacuApp')
  .service('Units', [function () {

    return {
      //The angle type of the wheelchair image
      unitSys: {
        METRIC: 0,
        IMPERIAL: 1,
      },

      //Returns the appropriate weight unit name
      getWeightName: function (myUnitSys) {
        switch (myUnitSys) {
          case this.unitSys.IMPERIAL:
            return 'lbs';
          case this.unitSys.METRIC:
            return 'kg';
          default:
            return 'weight units';
        }
      },

      //Returns the factor used to convert from lbs to given weight unit
      getWeightFactor: function (myUnitSys) {
        switch (myUnitSys) {
          case this.unitSys.IMPERIAL:
            return 1;
          case this.unitSys.METRIC:
            return 0.453592;
          default:
            return 1;
        }
      }
    }

  }]);

