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
  .controller('CartCtrl', ['$scope', '$location', '$cookieStore', 'User', 'FrameData', 'Units', 'Wheelchair', 'Drop',
    function ($scope, $location, $cookieStore, User, FrameData, Units, Wheelchair, Drop) {

      Drop.setFalse();

      //Array of wheelchair objects designed by user
      $scope.wheelchairs = User.getDesignedWheelchairs();


      $scope.emptyCols = [];

      $scope.parts = [];
      //Array tracking if wheelchair is in curOrder
      $scope.wInOrder = [];

      //Array tracking wheelchairs in current order (wInOrder[i] = j means $scope.wheelchairs[i] is at index j in curOrder)
      //If j === -1 then $scope.wheelchairs[i] is not in curOrder
      $scope.wOrderIndex = [];

      $scope.imageDisplay1 = -1;

      $scope.hoverImage = 'add_icon';
      //A reference to User.curEditOrder (set during init())
      var curOrder = null;
      $scope.orderChairs;
      //Initialize Cart page
      function init() {

        curOrder = User.getCurEditOrder()
        if (!curOrder) {
          User.createNewOrder();
          curOrder = User.getCurEditOrder();
        } else {
          updateCosts();
        }
        //if($cookieStore.get('cart') == null){
        //  User.createNewOrder();
        //  curOrder = User.getCurEditOrder();
        //  console.log("cookie is empty")
        //} else{
        //  var tempCurOrder = $cookieStore.get('cart') || [];
        //  for(var i = 0; i < tempCurOrder.wheelchairs.length; i++){
        //    curOrder.push(new Wheelchair(tempCurOrder.wheelchairs[i]));
        //  }
        //  console.log("cartItem from cookie " + JSON.stringify(curOrder));
        //}

        $scope.orderChairs = curOrder.getWheelchairs();
        var orderInd = 0;
        for (var i = 0; i < $scope.wheelchairs.length; i++) {
          $scope.wInOrder.push($scope.wheelchairs[i].inCurOrder);
          if ($scope.wInOrder[i])
            $scope.wOrderIndex.push(orderInd++);
          else
            $scope.wOrderIndex.push(-1);
          getParts($scope.wheelchairs[i].getFrameID());
        }

        for (var j = $scope.wheelchairs.length; j < 3; j++) {
          $scope.emptyCols.push({});
        }

      }

      function getParts(fID) {
        var frame = FrameData.getFrame(fID);
        var parts = frame.getParts();
        for (var i = 0; i < parts.length; i++) {
          if (!inPartsArray(parts[i])) {
            $scope.parts.push(parts[i]);
          }
        }
      }

      function inPartsArray(part) {
        for (var i = 0; i < $scope.parts.length; i++) {
          if (part.getName() === $scope.parts[i].getName()) {
            return true;
          }
        }
        return false;
      }


      $scope.panelSelected = function (hoveritem, index, part) {
        return hoveritem.index === index && hoveritem.name === part.getName();
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
        $scope.emptyCols.push({});
        User.updateDB();
      };


      //Adds the selected wheelchair to curOrder
      $scope.addWheelchairToOrder = function (index) {
        //if ($scope.wheelchairs[index].allMeasuresSet() === false) {
        //  alert('All measurements must be set before this can be purchased');
        //  return;
        //}
        curOrder.addWheelchair($scope.wheelchairs[index]);
        User.updateCookie();
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
        User.updateCookie();
        User.updateDB();
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
        $scope.costs.total = curOrder.getTotalCost().toFixed(2);
      }

      /*********************CHECK OUT***********************************/

        //Validates the user's "cart" and sends the user to Checkout or Order if valid
      $scope.checkOut = function () {
        if (curOrder.getNumWheelchairs() === 0) {
          alert('Your cart is empty');
          return;
        }

        if (User.isLoggedIn())
          $location.path('order'); //Send to Order if logged in
        else
          $location.path('checkout'); //Send to Checkout if not logged in
      };

      //Determines if the current cart is valid
      $scope.validCart = function () {
        return curOrder.getNumWheelchairs() > 0;
      };

      $scope.toggleImageDisplay = function (index) {
        $scope.imageDisplay1 = index;
      };

      /********************DETAIL PANEL*********************************/

        //Returns the weight of the given wheelchair as a displayable string
      $scope.getWeightString = function (wheelchair) {
        return (wheelchair.getTotalWeight() * Units.getWeightFactor(User.getUnitSys())).toFixed(2) + ' ' + Units.getWeightName(User.getUnitSys());
      };

      //Returns an object of display-friendly strings regarding the given part
      $scope.getPartDetails = function (wheelchair, part) {
        return wheelchair.getPartDetails(part.partID, User.getUnitSys());
      };

      $scope.getPartOption = function (wheelchair, part) {
        return $scope.getPartDetails(wheelchair, part).optionName;
      };

      //Returns an object of display-friendly strings regarding the given measure
      $scope.getMeasureDetails = function (wheelchair, measure) {
        return wheelchair.getMeasureDetails(measure.measureID, User.getUnitSys());
      };

      $scope.rotate = function (dir) {
        if($scope.imageDisplay1 + dir === -1)
          $scope.imageDisplay1 = $scope.wheelchairs.length - 1;
        else
        if($scope.imageDisplay1 + dir === $scope.wheelchairs.length)
          $scope.imageDisplay1 = 0;
        else
          $scope.imageDisplay1 += dir;
        console.log($scope.imageDisplay1);
      };

      init();

    }]);

