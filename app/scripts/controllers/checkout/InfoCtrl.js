// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:InfoCtrl
 * @description
 * # InfoCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('InfoCtrl', function ($scope, $location, sharedVars) {

    //Model for the contact form
    $scope.contactForm = {
      fName: "",
      lName: "",
      email: "",
      phone: ""
    };

    //Model for the shipping form
    $scope.shippingForm = {
      addr: "",
      addr2: "",
      city: "",
      state: ""
    };

    //Return the user to their cart
    $scope.returnToCart = function () {
      $location.path('/cart');
    };

    //Return to the previous stage of checkout
    $scope.back = function () {
      //TODO: Implement this

      //If guest, go to 'checkout'
      $location.path('/checkout');

      //If logged in, go to 'cart'
      //$location.path('/cart');
    };

    //Advance to the next stage of checkout (Payment)
    $scope.next = function () {
      //TODO: Verify inputs

      $location.path('/payment');
    };

  });
