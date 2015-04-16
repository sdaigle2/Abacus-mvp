// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
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

    //The index of the cart whose detail panel is open, -1 = None
    $scope.curDetailPanel = -1;

    $scope.seeWheelchairDetails = function (index) {
      if ($scope.curDetailPanel == index)
        $scope.curDetailPanel = -1;
      else
        $scope.curDetailPanel = index;
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
      for (var i = 0; i < $scope.wheelchairs.length; i++) {
        total += $scope.wheelchairs[i].calcPrice;
      }
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

    /*********************CHECK OUT***********************************/

    $scope.checkOut = function () {
      if ($scope.wheelchairs.length == 0) {
        alert("Your cart is empty");
        return;
      }

      //TODO: Checkout stuff
      //TODO: Verify all measurements for wheelchairs selected

      //If not logged in
      $location.path('/checkout');

      //If logged in
      //$location.path('/info');
    };

    /********************DETAIL PANEL*********************************/

    $scope.frameData = frameDataFromDB;

    //Get data for curWheelchair.Part object
    $scope.getPartDetails = function (wheelchairPart) {
      var part = getPartData(wheelchairPart.partID);
      var option = getOptionData(wheelchairPart.optionID, part);
      var colorName = "";
      if (option.colors.length > 0)
        colorName = getColorByID(wheelchairPart.colorID, option).name;
      var priceString = (option.price < 0) ? "-$" : "$";
      priceString += Math.abs(option.price.toFixed(2));
      var weightString = option.weight.toFixed(2) + " " + "lbs"; //TODO: Set up imperial/metric toggle
      return {
        partName: part.name,
        optionName: option.name,
        colorName: colorName,
        priceString: priceString,
        weightString: weightString
      };
    };

    //Get data for curWheelchair.Measure object
    $scope.getMeasureDetails = function (wheelchairMeasure) {
      var i = wheelchairMeasure.measureOptionIndex;
      var meas = getMeasureData(wheelchairMeasure.measureID);
      var measOption = "NOT SELECTED";
      var measPrice = "$0.00";
      var measWeight = "0.00 lbs";
      if (i != -1) {
        measOption = meas.measureOptions[1][i];  //TODO: Set up imperial/metric toggle
        measOption += " " + meas.units[1]; //Here too
        measPrice = ((meas.prices[i] < 0) ? "-$" : "$") + Math.abs(meas.prices[i].toFixed(2));
        measWeight = meas.weights[i].toFixed(2) + " " + "lbs"; //And here
      }
      return {
        name: meas.name,
        option: measOption,
        price: measPrice,
        weight: measWeight
      }
    };

    function getPartData(id) {
      for (var i = 0; i < $scope.frameData.parts.length; i++) {
        var curPart = $scope.frameData.parts[i];
        if (curPart.partID === id) {
          return curPart;
        }
      }
      return null;
    }

    function getOptionData(id, curPart) {

      for (var j = 0; j < curPart.options.length; j++) {
        var curOption = curPart.options[j];
        if (curOption.optionID === id) {
          return curOption;
        }
      }

      return null;
    }

    function getMeasureData(id) {
      for (var i = 0; i < $scope.frameData.measures.length; i++) {
        var curMeas = $scope.frameData.measures[i];
        if (curMeas.measureID === id) {
          return curMeas;
        }
      }
      return null;
    }

    function getColorByID(colorID, curOption) {
      for (var i = 0; i < curOption.colors.length; i++) {
        if (curOption.colors[i].colorID === colorID) {
          return curOption.colors[i];
        }
      }
    }
  });
