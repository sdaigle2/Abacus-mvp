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


    var curOrder = null;

    //Initialize Cart page
    function init() {
      User.createNewOrder();
      curOrder = User.getCurEditOrder();

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
        curOrder.removeWheelchair(orderInd);
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

      curOrder.addWheelchair($scope.wheelchairs[index]);
      $scope.wInOrder[index] = true;
      $scope.wOrderIndex[index] = curOrder.getNumWheelchairs() - 1;
      updateCosts();
    };

    //Removes the selected wheelchair from curOrder
    $scope.removeWheelchairFromOrder = function (index) {
      curOrder.removeWheelchair($scope.wOrderIndex[index]);
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
      $scope.costs.subtotal = curOrder.getSubtotal();
      $scope.costs.tax = curOrder.getTaxCost();
      $scope.costs.shipping = curOrder.getShippingCost();
      $scope.costs.total = curOrder.getTotalCost();
    };

    /*********************CHECK OUT***********************************/

    $scope.checkOut = function () {
      if (curOrder.getNumWheelchairs() === 0) {
        alert('Your cart is empty');
        return;
      }
     
      if (User.isLoggedIn())
        $location.path('order');
      else
        $location.path('checkout');
    };

    $scope.validCart = function () {
      return curOrder.getNumWheelchairs() > 0;
    };

    /********************DETAIL PANEL*********************************/

    $scope.getWeightString = function (wheelchair) {
      return (wheelchair.getTotalWeight() * Units.getWeightFactor(User.getUnitSys())).toFixed(2) + ' ' + Units.getWeightName(User.getUnitSys());
    };

    $scope.getPartDetails = function(wheelchair, part) {
      return wheelchair.getPartDetails(part.partID, User.getUnitSys());
    };

    $scope.getMeasureDetails = function(wheelchair, measure) {
      return wheelchair.getMeasureDetails(measure.measureID, User.getUnitSys());
    };

    init();

  }]);
