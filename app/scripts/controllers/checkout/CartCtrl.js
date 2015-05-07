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
  .controller('CartCtrl', ['$scope', '$location', 'User', 'FrameData', 'Units', 
    function ($scope, $location, User, FrameData, Units) {

    //Array of wheelchair objects designed by user
    $scope.wheelchairs = User.getDesignedWheelchairs();

    //Array tracking if wheelchair is in curOrder
    $scope.wInOrder = [];

    //Array tracking wheelchairs in current order (wInOrder[i] = j means $scope.wheelchairs[i] is at index j in curOrder)
    //If j === -1 then $scope.wheelchairs[i] is not in curOrder
    $scope.wOrderIndex = [];


    $scope.curOrder = null;

    //Initialize Cart page
    function init() {
      User.createNewOrder();
      $scope.curOrder = User.getCurEditOrder();

      for (var i = 0; i < $scope.wheelchairs.length; i++) {
        $scope.wOrderIndex.push(-1);
        $scope.wInOrder.push(false);
      }
        
    };

    /********************CART ITEM BUTTONS******************************/

    //The index of the cart whose detail panel is open, -1 = None
    $scope.curDetailPanel = -1;

    //Opens up a panel with details about the selected wheelchair
    $scope.seeWheelchairDetails = function (index) {
      if ($scope.curDetailPanel == index)
        $scope.curDetailPanel = -1;
      else
        $scope.curDetailPanel = index;
    };

    //Sends the user back to abacus with the selected wheelchair
    $scope.editWheelchair = function (index) {
      User.setEditWheelchair(index);
      $location.path('abacus');
    };

    //Deletes wheelchair from user's My Designs
    $scope.deleteWheelchair = function (index) {
      //Remove wheelchair from order if in order
      var orderInd = $scope.wOrderIndex[index];
      if (orderInd !== -1) {
        $scope.curOrder.removeWheelchair(orderInd);
      }
      $scope.wOrderIndex.splice(index, 1);
      $scope.wInOrder.splice(index, 1);

      //Remove wheelchair from My Designs
      User.deleteWheelchair(index);

      //TODO: Save changes to DB
    };


    //Adds the selected wheelchair to curOrder
    $scope.addWheelchairToOrder = function (index) {
      if ($scope.wheelchairs[index].allMeasuresSet() === false) {
        alert('All measurements must be set before this can be purchased');
        return;
      }

      $scope.curOrder.addWheelchair($scope.wheelchairs[index]);
      $scope.wInOrder[index] = true;
      $scope.wOrderIndex[index] = $scope.curOrder.getNumWheelchairs() - 1;
      updateCosts();
    };

    //Removes the selected wheelchair from curOrder
    $scope.removeWheelchairFromOrder = function (index) {
      $scope.curOrder.removeWheelchair($scope.wOrderIndex[index]);
      $scope.wInOrder[index] = false;
      for (var i = 0; i < $scope.wOrderIndex.length; i++)
        if ($scope.wOrderIndex[i] > $scope.wOrderIndex[index])
          $scope.wOrderIndex[i]--;
      $scope.wOrderIndex[index] = -1;
      updateCosts();
    };

    /********************SIDEBAR CALCULATIONS************************/
    $scope.costs = {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0
    };

    function updateCosts() {
      $scope.costs.subtotal = $scope.curOrder.getSubtotal();
      $scope.costs.tax = $scope.curOrder.getTaxCost();
      $scope.costs.shipping = $scope.curOrder.getShippingCost();
      $scope.costs.total = $scope.curOrder.getTotalCost();
    };

    /*********************CHECK OUT***********************************/

    $scope.checkOut = function () {



      //If not logged in
      $location.path('/checkout');
      //If logged in
      //$location.path('/info');
    };

    /********************DETAIL PANEL*********************************/

    $scope.getWeightString = function (wheelchair) {
      return (wheelchair.getTotalWeight() * Units.getWeightFactor(User.unitSys)).toFixed(2) + ' ' + Units.getWeightName(User.unitSys);
    };

    //Get data for curWheelchair.Part object
    $scope.getPartDetails = function (fID, curPart) {
      var pID = curPart.partID;
      var oID = curPart.optionID;
      var cID = curPart.colorID;

      var part = FrameData.getFramePart(fID, pID);
      var option = part.getOption(oID);
      var color = option.getColor(cID);

      var colorName = (color === null) ? '' : color.getName();

      var priceString = (option.getPrice() < 0) ? '-$' : '$';
      priceString += Math.abs(option.getPrice()).toFixed(2);

      var weightString = (option.getWeight() * Units.getWeightFactor(User.unitSys)) + ' ' + Units.getWeightName(User.unitSys);

      return {
        partName: part.getName(),
        optionName: option.getName(),
        colorName: colorName,
        priceString: priceString,
        weightString: weightString
      };
    };

    //Get data for curWheelchair.Measure object
    $scope.getMeasureDetails = function (fID, curMeas) {
      var mID = curMeas.measureID;
      var i = curMeas.measureOptionIndex;
      var meas = FrameData.getFrameMeasure(fID, mID);

      var optionString = 'NOT SELECTED';
      var priceString = '';
      var weightString = '';

      if (i != -1) {
        optionString = meas.getOption(User.unitSys, i);
        optionString += " " + meas.getUnits(User.unitSys);
        priceString = ((meas.getPrice(i) < 0) ? "-$" : "$") + Math.abs(meas.getPrice(i).toFixed(2));
        weightString = (meas.getWeight(i) * Units.getWeightFactor(User.unitSys)) + ' ' + Units.getWeightName(User.unitSys);
      }

      return {
        name: meas.getName(),
        optionString: optionString,
        priceString: priceString,
        weightString: weightString
      }
    };

    init();

  }]);
