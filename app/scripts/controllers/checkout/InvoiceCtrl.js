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
      return {
        partName: part.name,
        optionName: option.name,
        colorName: colorName,
        price: option.price
      };
    };

    //Get data for curWheelchair.Measure object
    $scope.getMeasureDetails = function (wheelchairMeasure) {
      var meas = getMeasureData(wheelchairMeasure.measureID);
      var measOption = "NOT SELECTED";
      var measUnits = "";
      var measPrice = 0;
      if (wheelchairMeasure.measureOptionIndex != -1) {
        measOption = meas.measureOptions[0][wheelchairMeasure.measureOptionIndex];  //TODO: Set up imperial/metric toggle
        measUnits = meas.units[0];
        measPrice = meas.prices[wheelchairMeasure.measureOptionIndex];
      }
      return {
        measName: meas.name,
        measOption: measOption,
        measUnit: measUnits,
        measPrice: measPrice
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
