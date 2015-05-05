'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static factory:costService
 * @description
 * # costService
 * Service of the abacuApp
 */
angular.module('abacuApp')
  .constant('Costs', {
      TAX_RATE: 0.097,
      SHIPPING_FEE: 15,
  });

