// jshint unused:false
/* globals frameDataFromDB, cartDataFromDB, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('CartCtrl', function ($scope) {

    var SHIP_FEE_PER_WHEELCHAIR = 15;
    var TAX_RATE = 0.20;

    $scope.wheelchairs = cartDataFromDB;

    /********************CART ITEM BUTTONS******************************/

    $scope.seeWheelchairDetails = function (index) {
      alert("seeWheelchairDetails("+index+")");
    };

    $scope.editWheelchair = function (index) {

      //TODO load this as our current wheelchair


      //TODO redirect user back to the design area


      alert("editWheelchair(" + index + ")");
    };

    $scope.removeWheelchair = function (index) {
      //TODO: Something more database-y
      $scope.wheelchairs.splice(index, 1);
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
