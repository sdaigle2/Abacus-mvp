// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:InvoiceCtrl
 * @description
 * # InvoiceCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('InvoiceCtrl', function ($scope, $location, sharedVars) {
    $scope.wheelchairs = cartDataFromDB; //TODO: curWheelchair?
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
      if (wheelchairMeasure.measureOptionIndex != -1) {
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
    };

    /****************Weight and Price******************/

      //Calculated Total Weight and Price
    $scope.getTotalWeight = function () {
      var totalWeight = $scope.frameData.baseWeight;
      for (var i = 0; i < $scope.wheelchairs.parts.length; i++) {
        var curPart = $scope.wheelchairs.parts[i];
        totalWeight += curPart.weight;
      }
      for (var i = 0; i < $scope.wheelchairs.measures.length; i++) {
        var curMeas = getMeasureData($scope.wheelchairs.measures[i].measureID);
        if ($scope.wheelchairs.measures[i].measureOptionIndex != -1)
          totalWeight += curMeas.weights[$scope.wheelchairs.measures[i].measureOptionIndex];
      }
      return totalWeight;
    };

    $scope.getTotalPrice = function () {
      var totalPrice = $scope.frameData.basePrice;
      for (var i = 0; i < $scope.wheelchairs.parts.length; i++) {
        var curPart = $scope.wheelchairs.parts[i];
        totalPrice += curPart.price;
      }
      for (var i = 0; i < $scope.wheelchairs.measures.length; i++) {
        var cuwheelchairsMeas = getMeasureData($scope.wheelchairs.measures[i].measureID);
        if ($scope.wheelchairs.measures[i].measureOptionIndex != -1)
          totalPrice += curMeas.prices[$scope.wheelchairs.measures[i].measureOptionIndex];
      }
      return totalPrice;
    };

    //total price with sale tax, shipping, other
    $scope.TotalPrice = function (){

    }

  });
