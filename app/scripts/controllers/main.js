'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
