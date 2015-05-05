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

    $scope.seeWheelchairDetails = function (index) {
      if ($scope.curDetailPanel == index)
        $scope.curDetailPanel = -1;
      else
        $scope.curDetailPanel = index;
    };

    $scope.editWheelchair = function (index) {
      User.setEditWheelchair(index);
      $location.path('abacus');
    };

    $scope.removeWheelchair = function (index) {
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

    /********************SIDEBAR CALCULATIONS************************/
    $scope.costs = {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0
    };

    /*********************CHECK OUT***********************************/

    $scope.checkOut = function () {



      //If not logged in
      $location.path('/checkout');
      //If logged in
      //$location.path('/info');
    };

    /********************DETAIL PANEL*********************************/

    //Get data for curWheelchair.Part object
    $scope.getPartDetails = function (fID, pID, oID, cID) {
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
    $scope.getMeasureDetails = function (fID, mID, optionIndex) {
      var i = optionIndex;
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
