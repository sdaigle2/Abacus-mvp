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
      extra: 'Lorem ipsum',
      color: '#000000'
    },
    {
      name: 'Scott Daigle',
      extra: 'Source of name-based confusion',
      color: '#ff0000'
    },
    {
      name: 'Josh George',
      extra: 'Actually a World Champion',
      color: '#00ff00'
    },
    {
      name: 'Brian Zhou',
      extra: 'Clash of clans World Champion 2015',
      color: '#0000ff'
    },
    {
      name: 'Steven Pick',
      extra: 'Pretty fly',
      color: '#ffff00'
    },
    {
      name: 'Matt Kowalec',
      extra: 'Many knowledges',
      color: '#ff00ff'
    },
    {
      name: 'Sarah Cho',
      extra: 'Didn\'t have any say on this page\'s design',
      color: '#00ffff'
    },
    {
      name: 'Scott Blessing',
      extra: 'He\'s cool',
      color: '#880000'
    },
    {
      name: 'Nick Galloway',
      extra: 'He\'s also cool',
      color: '#008800'
    },
    {
      name: 'Nadda Realperson',
      extra: 'An actual Nigerian Prince',
      color: '#000088'
    },
    {
      name: 'Dhruv Vajpeyi',
      extra: 'He stole my job!',
      color: '#888800'
    },
    {
      name: 'Jason',
      extra: 'He stole Nick\'s job!',
      color: '#123456'
    },
    {
      name: 'Dhruv\'s Ego',
      extra: 'It\'s out of control!',
      color: '#880088'
    },
    {
      name: 'Fit Gripz',
      extra: 'The easiest way to type',
      color: '#008888'
    },
    {
      name: 'Caffeine',
      extra: 'The true hero',
      color: '#888888'
    },
    {
      name: 'sWeel',
      extra: 'The lightest wheel on the planet',
      color: '#ffbb55'
    },
    {
      name: 'IllinoisNet',
      extra: 'Broken connections lead to broken hearts',
      color: '#789abc'
    },
    {
      name: 'EnterpriseWorks',
      extra: 'Incubator-tastic',
      color: '#def123'
    },
    {
      name: 'The NSA',
      extra: '',
      color: '#eeeeee'
    }]

  }]);
