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

      //Unit systems
      unitSys: {
        METRIC: 0,
        IMPERIAL: 1
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

      //Returns the multiplication factor used to convert from lbs to given weight unit
      getWeightFactor: function (myUnitSys) {
        switch (myUnitSys) {
          case this.unitSys.IMPERIAL:
            return 2.20462;
          case this.unitSys.METRIC:
            return 1;
          default:
            return 1;
        }
      }
    }

  }]);

