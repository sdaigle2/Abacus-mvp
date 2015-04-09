// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:CheckoutCtrl
 * @description
 * # CheckoutCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('CheckoutCtrl', function ($scope, $location, sharedVars) {

    //Login Form Model
    $scope.loginForm = {
      email: "",
      pass: ""
    };

    //Return the user to their cart
    $scope.returnToCart = function () {
      $location.path('/cart');
    };

    //Validate user login, and then log them in
    $scope.loginAsUser = function () {
      //TODO: Validate $scope.loginForm inputs
      //      Log user in
      //      Send to "Info" Page

      //loginForm.email should be verified as an email address by the HTML - it should be null if not an email

      alert(JSON.stringify($scope.loginForm));
      $location.path('/info');
    };

    //Log in the user as a guest
    $scope.loginAsGuest = function () {
      //TODO: Mark user as a guest?
      $location.path('/info');
    };

    //Launch password recovery
    $scope.recoverPassword = function () {
      //TODO: Recover Password
      alert("Your password is \'hunter2\'");
    };

    //Register a new user account
    $scope.register = function () {
      //TODO: Register the user
      alert("COMING SOON!!!");
    };

  });