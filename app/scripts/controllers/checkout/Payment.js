// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:PaymentCtrl
 * @description
 * # PaymentCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('PaymentCtrl', function ($scope, $location, sharedVars) {
    //Return the user to their cart
    $show = false;

    $scope.displayToggle(){
      $show
    };

    $scope.returnToCart = function () {
      $location.path('/cart');
    };

    $scope.back = function () {
      //TODO: Implement this

      //get back to info
      $location.path('/info');


    };

    //Advance to the next stage of checkout (complete)
    $scope.next = function () {
      //TODO: Verify inputs

      $location.path('/complete');
    };

  });
