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
    'ngTouch',
    'ngDialog',
    'ngclipboard',
    'angular-loading-bar',
    'ui.bootstrap'
  ])
  .run(['$rootScope', '$location', function ($rootScope, $location) {
    var forceSSL = function() {
      if ($location.protocol() !== 'https' && window.location.hostname !== 'localhost') {
        window.location.href = $location.absUrl().replace(/http/g, 'https');
      }
    };
    forceSSL();
    // Attach lodash object to $rootScope so it can be used in views
    $rootScope._ = window._;
    $rootScope.$on('$routeChangeError', function() {
      $location.path('/');
    });
  }])
  .config(function ($routeProvider, $sceDelegateProvider, $httpProvider, $locationProvider ,cfpLoadingBarProvider) {

    
    $locationProvider.hashPrefix('!');
    // $locationProvider.html5Mode(true);

    // Set up routes
    $routeProvider
      .when('/', {
        templateUrl: 'views/landing.html',
        controller: 'LandingCtrl'
      })
      .when('/frames', {
        templateUrl: 'views/frame.html',
        controller: 'FrameCtrl'
      })
      .when('/password-reset', {
        templateUrl: 'views/forgot/resetLink.html',
        controller: 'ForgotCtrl'
      })
      .when('/change-password/:resetToken', {
        templateUrl: 'views/forgot/changePassword.html',
        controller: 'ForgotCtrl'
      })
      .when('/tinker', {
        templateUrl: '../views/tinker/abacus.html',
        controller: 'AbacusCtrl',
        resolve: {
          UserData: ['$q', 'User', function($q, User) {
            return User.getPromise();
          }]
        }
      })
      .when('/tinker/:param1', {
        templateUrl: '../views/tinker/abacus.html',
        controller: 'AbacusCtrl',
        resolve: {
          UserData: ['$q', 'User', function($q, User) {
            return User.getPromise();
          }]
        }
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/compare', {
        templateUrl: 'views/compare.html',
        controller: 'CompareCtrl'
      })
      .when('/mydesigns', {
        templateUrl: 'views/mydesigns.html',
        controller: 'MyDesignsCtrl',
        resolve: {
          UserData: ['$q', 'User', function($q, User) {
            return User.getPromise();
          }]
        }
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminController',
        controllerAs: 'admin',
        resolve: {
          UserData: ['$q', 'User', function($q, User) {
            var deferred = $q.defer();
            return User.getPromise()
            .then(function(resp) {
              var userData = resp.data || resp;
              if (userData.userType === 'admin' || userData.userType === 'superAdmin') {
                deferred.resolve();
              } else {
                deferred.reject('Only admins are allowed to view this page.');
              }
              
              return deferred.promise;
            })
          }]
        }
      })
      .when('/discounts', {
        templateUrl: 'views/discounts.html',
        controller: 'DiscountsController',
        controllerAs: 'discount',
        resolve: {
          UserData: ['$q', 'User', function($q, User) {
            var deferred = $q.defer();
            return User.getPromise()
            .then(function(resp) {
              var userData = resp.data || resp;
              if (userData.userType === 'admin' || userData.userType === 'superAdmin') {
                deferred.resolve();
              } else {
                deferred.reject('Only admins are allowed to view this page.');
              }
              
              return deferred.promise;
            })
          }]
        }
      })
      .when('/order/:orderId', {
        templateUrl: 'views/adminOrder.html',
        controller: 'OrdersController',
        controllerAs: 'order',
        resolve: {
          UserData: ['$q', 'User', function($q, User) {
            var deferred = $q.defer();
            return User.getPromise()
            .then(function(resp) {
              var userData = resp.data || resp;
              if (userData.userType === 'admin' || userData.userType === 'superAdmin') {
                deferred.resolve();
              } else {
                deferred.reject('Only admins are allowed to view this page.');
              }
              
              return deferred.promise;
            })
          }]
        }
      })
      .when('/cart2', {
        templateUrl: 'views/checkout/cart.html',
        controller: 'CartCtrl',
        resolve: {
          UserData: ['$q', 'User', function($q, User) {
            return User.getPromise();
          }]
        }
      })
      .when('/cart', { // replace all references to 'Cart2' to just 'cart' when ready
        templateUrl: 'views/checkout/cart2.html',
        controller: 'Cart2Ctrl',
        resolve: {
          UserData: ['$q', 'User', function($q, User) {
            return User.getPromise();
          }]
        }
      })
      .when('/searchid', {
        templateUrl: 'views/searchid.html',
        controller: 'SearchIDCtrl',
        resolve: {
          UserData: ['$q', 'User', function($q, User) {
            return User.getPromise();
          }]
        }
      })
      .when('/checkout', {
        templateUrl: 'views/checkout/checkout.html',
        controller: 'CheckoutCtrl'
      })
      .when('/order', {
        templateUrl: 'views/checkout/order.html',
        controller: 'OrderCtrl'
      })
      .when('/order/:orderNum/payment', {
        templateUrl: 'views/checkout/orderPayment.html',
        controller: 'PaymentCtrl',
        controllerAs: 'payment',
        resolve: {UserData: ['$q', 'User', function($q, User){
          return User.getPromise();
        }]}
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        reloadOnSearch: false,
        resolve: {UserData: ['$q', 'User', function($q, User){
          return User.getPromise();
        }]}
      })
      .when('/save', {
        templateUrl: 'views/save.html',
        controller: 'SaveCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/confirm/:param1', {
        templateUrl: 'views/confirm.html',
        controller: 'ConfirmCtrl'
      })
      .when('/welcome', {
        templateUrl: 'views/register/welcome.html',
        controller: 'WelcomeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    //Allow Youtube URLs to load
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://www.youtube.com/embed/**',
      'http://www.youtube.com/embed/**',
      'http://http://www.intelliwheels.net/**'
    ]);
    $httpProvider.defaults.useXDomain = true;


    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';



  });

