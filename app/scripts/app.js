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
        controller: 'FrameCtrl'
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
      .when('/order', {
        templateUrl: '../views/checkout/order.html',
        controller: 'OrderCtrl'
      })
      .when('/invoice', {
        templateUrl: '../views/checkout/invoice.html',
        controller: 'InvoiceCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
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

  //.factory('orderFactory', function ($http){
  //  return{
  //    all: function(){
  //      return $http({method:"GET", url:"data/orderData"});
  //    },
  //    create: function(info){
  //      return $http({method:"POST", url:"data/orderData", data:info});
  //    }
  //  };
  //});
