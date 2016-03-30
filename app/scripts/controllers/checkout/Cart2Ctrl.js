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
  .constant('WHEELCHAIR_CANVAS_WIDTH', 187) // width of canvas that renders wheelchair
  .controller('Cart2Ctrl', ['$scope', '$location', 'localJSONStorage', 'User', '_', 'ComparedDesigns', 'MAX_COMPARISON_CHAIRS', 'FrameData', 'Units', 'Wheelchair', 'Drop', 'WHEELCHAIR_CANVAS_WIDTH', 'Design',
    function ($scope, $location, localJSONStorage, User, _, ComparedDesigns, MAX_COMPARISON_CHAIRS, FrameData, Units, Wheelchair, Drop, WHEELCHAIR_CANVAS_WIDTH, Design) {
      $scope.WHEELCHAIR_CANVAS_WIDTH = WHEELCHAIR_CANVAS_WIDTH;
      Drop.setFalse();

      $scope.guideSection = false;

      function isAComparedDesign(design) {
        return ComparedDesigns.cart.contains(design);
      }

      //Array of wheelchair instances in the shopping cart
      $scope.wheelchairUIOpts = [];

      $scope.parts = [];

      $scope.imageDisplay1 = -1;

      $scope.hoverImage = 'add_icon';
      //A reference to User.curEditOrder (set during init())
      $scope.curOrder = null;

      $scope.zipcode = null;


      //Initialize Cart page
      function init() {
        $scope.curOrder = User.getCurEditOrder();   //return order instance
        if (!$scope.curOrder) {
          User.createNewOrder();
          $scope.curOrder = User.getCurEditOrder();
          $scope.curOrder.wheelchairs = User.getCart().wheelchairs;
        }

        $scope.zipcode = $scope.curOrder.zip;

        // initialize the ui variables to a default value
        $scope.wheelchairUIOpts = User.getCart().wheelchairs.map(function (design) {
          return {
            'design': design,
            'checked': isAComparedDesign(design), // whether the checkbox in each cart item is marked
            'showInfo': false // whether to show the table of wheelchair parts
          };
        });

        // download the parts in $scope.parts
        $scope.wheelchairUIOpts.forEach(function (chairOpts) {
          getParts(chairOpts.design.wheelchair.getFrameID());
        });
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
        User.setEditWheelchair(index, $scope.wOrderIndex[index]);
        $location.path('/tinker');
      };

      // removes wheelchair from cart and puts it into the users wishlist
      $scope.moveToWishlist = function (index) {
        alert('TODO: moveToWishlist implementation');
      };

      $scope.duplicateWheelchair = function (index) {
        alert('TODO: duplicateWheelchair implementation');
      };

      //Deletes wheelchair from user's My Designs
      $scope.deleteWheelchair = function (index) {

        //$scope.wOrderIndex.splice(index, 1);
        $scope.wheelchairUIOpts.splice(index, 1);
        //
        ////Remove wheelchair from My Designs
        User.deleteWheelchair(index);
      };

      /*********************CHECK OUT***********************************/

      $scope.choosePayment = function (paymentMethod) {
        var paymentMethodCases = {
          'insurance': function () {
            alert('TODO: insurance payment handler');
          },
          'downPayment': function () {
            alert('TODO: downPayment payment handler');
          },
          'payFull': function () {
            alert('TODO: payFull payment handler');
          }
        };

        var invalidPaymentMethodHandler = function () {
          alert('The selected payment method is invalid');
        };

        var paymentHandler = paymentMethodCases[paymentMethod] || invalidPaymentMethodHandler;
        paymentHandler();
      };

      $scope.applyPaymentMethod = function () {
        alert('TODO: applyPaymentMethod implementation');
      };

      $scope.applyZipcode = function () {
        $scope.curOrder.zip = $scope.zipcode;
      };

        //Validates the user's "cart" and sends the user to Checkout or Order if valid
      $scope.checkOut = function () {
        if ($scope.curOrder.getNumWheelchairs() === 0) {
          alert('Your cart is empty');
          return;
        }

        if (User.isLoggedIn())
          $location.path('/order'); //Send to Order if logged in
        else
          $location.path('/checkout'); //Send to Checkout if not logged in
      };

      //Determines if the current cart is valid
      $scope.validCart = function () {
        return $scope.curOrder.getNumWheelchairs() > 0;
      };

      $scope.toggleImageDisplay = function (index) {
        $scope.imageDisplay1 = index;
      };

      /********************DETAIL PANEL*********************************/


      //Returns an object of display-friendly strings regarding the given part
      $scope.getPartDetails = function (wheelchair, part) {
        return wheelchair.getPartDetails(part.partID, User.getUnitSys());
      };

      $scope.getPartOption = function (wheelchair, part) {
        return $scope.getPartDetails(wheelchair, part).optionName;
      };

      // Get all the names for all the measured parts
      $scope.getWheelchairMeasures = function (wheelchair) {
        var frameID = wheelchair.getFrameID();
        var frame = FrameData.getFrame(frameID);
        var measures = frame.getMeasures();

        return measures;
      };

      //Returns an object of display-friendly strings regarding the given measure
      $scope.getMeasureDetails = function (wheelchair, measure) {
        return wheelchair.getMeasureDetails(measure.measureID, User.getUnitSys());
      };

      $scope.rotate = function (dir) {
        if($scope.imageDisplay1 + dir === -1)
          $scope.imageDisplay1 = $scope.wheelchairUIOpts.length - 1;
        else
        if($scope.imageDisplay1 + dir === $scope.wheelchairUIOpts.length)
          $scope.imageDisplay1 = 0;
        else
          $scope.imageDisplay1 += dir;
        console.log($scope.imageDisplay1);
      };

      init();

      //compare functions

      $scope.numChecked = function () {
        return _.filter($scope.wheelchairUIOpts, 'checked').length;
      };

      $scope.$watch('wheelchairUIOpts', function (newUIOpts, oldUIOpts) {

        // Get all the wheelchairUIOpts items that have been changed from what they were before
        var checkFlippedOpts = newUIOpts.filter(function (newOpt, index) {
          var oldOpt = oldUIOpts[index];
          return newOpt.checked !== oldOpt.checked;
        });

        // Split it into the ones that were checked and unchecked
        var checkedOpts = _.filter(checkFlippedOpts, 'checked');
        var uncheckedOpts = _.reject(checkFlippedOpts, 'checked');

        // Add them to the compared designs service
        checkedOpts.forEach(function (chairOpts) {
          ComparedDesigns.cart.addDesign(chairOpts.design);
        });

        // Remove them from the compared designs service
        uncheckedOpts.forEach(function (chairOpts) {
          ComparedDesigns.cart.removeDesign(chairOpts.design);
        });
      }, true);

      $scope.goToCompare = function () {
        $location.path('/compare').search({
          'from': 'cart'
        });
      };

    }]);

