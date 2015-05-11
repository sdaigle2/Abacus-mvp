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
      extra: 'Source of name-based confusion'
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
      extra: 'Pretty fly'
    },
    {
      name: 'Matt Kowalec',
      extra: 'Lorem ipsum'
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
    {
      name: 'Nadda Realperson',
      extra: 'An actual Nigerian Prince'
    },
    {
      name: 'Dhruv Vajpeyi',
      extra: 'He stole my job!'
    }]

  }]);
