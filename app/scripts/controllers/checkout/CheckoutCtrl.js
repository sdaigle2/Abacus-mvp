// jshint unused:false
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:CheckoutCtrl
 * @description
 * # CheckoutCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('CheckoutCtrl', ['$scope', '$location', 'User', 'Drop', function ($scope, $location, User, Drop) {

    Drop.setFalse();

    //Login Form Model
    $scope.loginForm = {
      email: '',
      pass: ''
    };

    //Return the user to their cart
    $scope.returnToCart = function () {
      $location.path('/cart');
    };

    //Validate user login, and then log them in
    $scope.loginAsUser = function () {

      //TODO: Make sure curOrder isn't lost - login will overwrite it

      User.login($scope.loginForm.email, $scope.loginForm.pass)
        .then(function () {
          $location.path('/order');
        }, function (message) {
          alert('Login failed: ' + message);
        });

      $scope.loginForm.pass = '';
    };

    //Log in the user as a guest
    $scope.loginAsGuest = function () {
      $location.path('/order');
    };

    //Launch password recovery
    $scope.recoverPassword = function () {
      //TODO: Recover Password
      alert('COMING SOON!!!');
    };

    //Register a new user account
    $scope.register = function () {
      $location.path('/register');
    };

  }]);
