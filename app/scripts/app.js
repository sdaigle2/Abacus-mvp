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
  .config(function ($routeProvider, $sceDelegateProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '../views/frame.html',
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
      .when('/cart', {
        templateUrl: '../views/checkout/cart.html',
        controller: 'CartCtrl'
      })
      .when('/checkout', {
        templateUrl: '../views/checkout/checkout.html',
        controller: 'CheckoutCtrl'
      })
      .when('/info', {
        templateUrl: '../views/checkout/info.html',
        controller: 'InfoCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    //Allow Youtube URLs to load
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://www.youtube.com/embed/**',
      'http://www.youtube.com/embed/**'
    ]);
  })
  .service('sharedVars', function () {
    var curWheelChairCartIndex = -1;

    return {
      getCurWheelChairCartIndex: function () {
        return curWheelChairCartIndex;
      },
      setCurWheelChairCartIndex: function(value) {
        curWheelChairCartIndex = value;
      }
    };
  });
