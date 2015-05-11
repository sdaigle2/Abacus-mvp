'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('AboutCtrl', ['$scope', function ($scope) {

    $scope.employees = [{
      name: 'Marissa Siebel'
    },
    {
      name: 'Scott Daigle'
    },
    {
      name: 'Josh George'
    },
    {
      name: 'Brian Zhou'
    },
    {
      name: 'Steven Pick'
    },
    {
      name: 'Matt Kowalec'
    },
    {
      name: 'Sarah Cho'
    },
    {
      name: 'Scott Blessing'
    },
    {
      name: 'Nick Galloway'
    },
    ]

  }]);
