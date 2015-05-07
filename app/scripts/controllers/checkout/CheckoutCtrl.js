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
  .controller('CheckoutCtrl', ['$scope', '$location', function ($scope, $location) {

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
      //TODO: Validate $scope.loginForm inputs
      //      Log user in
      //      Send to "Order" Page

      //loginForm.email should be verified as an email address by the HTML - it should be null if not an email

      //User.login($scope.loginForm.email, $scope.loginForm.pass);

      alert(JSON.stringify($scope.loginForm));
      $location.path('/order');
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
      //TODO: Register the user
      alert('COMING SOON!!!');
    };

  }]);