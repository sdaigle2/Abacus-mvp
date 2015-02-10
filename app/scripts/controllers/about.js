'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
