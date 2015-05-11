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
      name: 'Marissa Siebel',
      extra: 'Lorem ipsum'
    },
    {
      name: 'Scott Daigle',
      extra: 'dummy text goes here'
    },
    {
      name: 'Josh George',
      extra: 'Actually a World Champion'
    },
    {
      name: 'Brian Zhou',
      extra: 'Clash of clans World Champion 2015'
    },
    {
      name: 'Steven Pick',
      extra: 'dummy text goes here'
    },
    {
      name: 'Matt Kowalec',
      extra: 'dummy text goes here'
    },
    {
      name: 'Sarah Cho',
      extra: 'Didn\'t have any say on this page\'s design'
    },
    {
      name: 'Scott Blessing',
      extra: 'He\'s cool'
    },
    {
      name: 'Nick Galloway',
      extra: 'He\'s also cool'
    },
    ]

  }]);
