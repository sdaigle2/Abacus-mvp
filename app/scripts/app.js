'use strict';

/**
 * @ngdoc overview
 * @name abacuApp
 * @description
 * # abacuApp
 *
 * Main module of the application.
 */
angular
  .module('abacuApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/abacus', {
        templateUrl: 'views/abacus.html',
        controller: 'AbacusCtrl'
      })
      .when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      })
      .when('/about', {
          templateUrl: 'views/about.html',
          controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
