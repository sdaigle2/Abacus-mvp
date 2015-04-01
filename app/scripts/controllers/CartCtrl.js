// jshint unused:false
/* globals frameDataFromDB, cartDataFromDB, curWheelchair, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('CartCtrl', function ($scope, $location, sharedVars) {

    var SHIP_FEE_PER_WHEELCHAIR = 15;
    var TAX_RATE = 0.20;

    $scope.wheelchairs = cartDataFromDB;

    /********************CART ITEM BUTTONS******************************/

    $scope.seeWheelchairDetails = function (index) {
      alert("seeWheelchairDetails("+index+")");
    };

    $scope.editWheelchair = function (index) {
      sharedVars.setCurWheelChairCartIndex(index);
      $location.path('abacus');
    };

    $scope.removeWheelchair = function (index) {
      $scope.wheelchairs.splice(index, 1); //TODO: Something more database-y
    };

    /********************SIDEBAR CALCULATIONS************************/
    $scope.calculateSubtotal = function () {
      var total = 0;
      for (var i = 0; i < $scope.wheelchairs.length; i++)
        total += $scope.wheelchairs[i].calcPrice;
      return total;
    };

    $scope.calculateShippingFee = function () {
      return SHIP_FEE_PER_WHEELCHAIR * $scope.wheelchairs.length;
    };

    $scope.calculateTax = function () {
      return TAX_RATE * $scope.calculateSubtotal();
    };

    $scope.calculateTotalPrice = function () {
      return $scope.calculateSubtotal() + $scope.calculateShippingFee() + $scope.calculateTax();
    };

  });
