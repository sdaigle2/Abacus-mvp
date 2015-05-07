'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static factory: bankConstants
 * @description
 * # bankConstants
 * Constants of the abacuApp
 */
angular.module('abacuApp')
  .constant('Bank', {
    ACCOUNT_HOLDER: 'Abacus',
    ACCOUNT_NUMBER: '1234567890',
    BLZ: '123456',
    BANK_NAME: 'Chase Bank',
    IBAN: '67789027453',
    BIC: '09728453784695'
  });

