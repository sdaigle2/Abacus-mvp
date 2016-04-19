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
  .constant('PAYMENT_METHODS', [{'name': 'Credit Card', 'requiresAccount': false}, {'name': 'Credit Card when Order Ships', 'requiresAccount': true}, {'name': 'Grant', 'requiresAccount': false}, {'name': 'Bill me Net 30', 'requiresAccount': true}])
  .controller('Cart2Ctrl', ['$scope', '$location', 'localJSONStorage', 'User', '_', 'ComparedDesigns', 'MAX_COMPARISON_CHAIRS', 'FrameData', 'Units', 'Wheelchair', 'Drop', 'WHEELCHAIR_CANVAS_WIDTH', 'Design', 'USER_TYPES', 'PAYMENT_METHODS',
    '$q', 'Errors', 'ngDialog', 'PromiseUtils', 'Discount', '$http', 'DownloadPDF',
    function ($scope, $location, localJSONStorage, User, _, ComparedDesigns, MAX_COMPARISON_CHAIRS, FrameData, Units, Wheelchair, Drop, WHEELCHAIR_CANVAS_WIDTH, Design, USER_TYPES, PAYMENT_METHODS, $q, Errors, ngDialog, PromiseUtils, Discount, $http, DownloadPDF) {
      $scope.WHEELCHAIR_CANVAS_WIDTH = WHEELCHAIR_CANVAS_WIDTH;
      $scope.USER_TYPES = USER_TYPES;
      $scope.PAYMENT_METHODS = PAYMENT_METHODS;

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
      $scope.discountCode = "";
      $scope.promoErr = "";

      var discount = new Discount();

      //Initialize Cart page
      function init() {
        $scope.curOrder = User.getCurEditOrder();   //return order instance
        if (!$scope.curOrder) {
          User.createNewOrder();
          $scope.curOrder = User.getCurEditOrder();
          $scope.curOrder.wheelchairs = User.getCart().wheelchairs;
        }

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
          getParts(chairOpts.design.wheelchair);
        });
      }



      function getParts(wheelchair){
        var frames = FrameData.getFrame(wheelchair.frameID);
        for (var i = 0; i < wheelchair.parts.length; i++) {
          $scope.parts.push(wheelchair.parts[i]);
          $scope.parts[i].name = frames.getPart(wheelchair.parts[i].partID).getName();
          $scope.parts[i].optionName = frames.getPart(wheelchair.parts[i].partID).getOption(wheelchair.parts[i].optionID).getName();
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

      $scope.isLoggedIn = function () {
        return User.isLoggedIn();
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
        if ($scope.wheelchairUIOpts[index].checked) {
          // if the item is checked, remove it from ComparedDesigns
          ComparedDesigns.cart.removeDesign($scope.wheelchairUIOpts[index].design);
        }

        User.setEditWheelchair(index, $scope.wheelchairUIOpts[index].design);
        $location.path('/tinker');
      };

      // removes wheelchair from cart and puts it into the users wishlist
      $scope.moveToWishlist = function (index) {
        var design = $scope.wheelchairUIOpts[index].design;
        // Remove the wheelchair from the cart and move it into the wishlist
        $scope.deleteWheelchair(index)
        .then(function () {
          // If the design already is in the backend with an ID, no need to make a new entry for it
          if (design instanceof Design && design.hasID()) {
            return design;
          } else {
            // Make a new entry for the design in the DB
            return User.saveDesign(design);
          }
        })
        .then(function (design) {
          return User.addDesignIDToSavedDesigns(design._id);
        })
        .catch(function (err) {
          console.log(err);
        });
      };

      $scope.duplicateWheelchair = function (index) {
        alert('TODO: duplicateWheelchair implementation');
      };

      //Deletes wheelchair from user's My Designs
      $scope.deleteWheelchair = function (index) {

        //$scope.wOrderIndex.splice(index, 1);
        $scope.wheelchairUIOpts.splice(index, 1);
        //
        ////Remove wheelchair from cart
        return User.deleteWheelchair(index);
      };

      /*********************CHECK OUT***********************************/
      $scope.showLoginModal = function () {
        if (User.isLoggedIn()) {
          return PromiseUtils.resolved();
        } else {
          return ngDialog.open({
            'template': 'views/modals/loginPromptModal.html'
          }).closePromise
          .then(function () {
            return Drop.setTrue(); // returns a promise that is resolved once the login dropdown is closed
          })
          .then(function () {
            return User.getPromise();
          })
          .then(function () {
            if (!User.isLoggedIn()) {
              throw new Errors.NotLoggedInError("User didn't login after dropdown");
            }
          });
        }
      };

      $scope.chooseUserType = function (userType) {
        if (userType.requiresAccount) {
          $scope.showLoginModal()
          .then(function () {
            $scope.curOrder.userType = userType.name;
          });
        } else {
          $scope.curOrder.userType = userType.name;
        }
      };

      $scope.choosePayment = function (paymentMethod) {
        if (paymentMethod.requiresAccount) {
          $scope.showLoginModal()
          .then(function () {
            $scope.curOrder.payMethod = paymentMethod.name;
          });
        } else {
          $scope.curOrder.payMethod = paymentMethod.name;
        }
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
        return _.countBy($scope.wheelchairUIOpts, 'checked').true || 0;
      };

      $scope.$watch('wheelchairUIOpts', function (newUIOpts, oldUIOpts) {
        if (newUIOpts.length !== oldUIOpts.length) {
          return; // only works if arrays are same length
        }

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
        $location
          .path('/compare')
          .search({
            'from': 'cart'
          });
      };


      /*****discount  function*******/
      $scope.applyDiscount = function(){

        Discount.fetchDiscount($scope.discountCode)
          .then(function(newDiscount){
            discount = newDiscount;
            $scope.curOrder.addDiscount(discount);
            $scope.curOrder.getTotalCost();
            $scope.promoErr = '';
            return User.updateCart();
          })
          .catch(function(err) {
            if(err.status == 404){
              alert('Sorry, did not find your promo code');
            } else if (err instanceof Errors.CantCombineDiscountError) {
              alert('Cannot combine this discount with the discounts you currently have');
            } else if (err instanceof Errors.CantAddDiscountError) {
              alert('You cannot add another discount to your order');
            } else if (err instanceof Errors.ExpiredDiscountError) {
              alert('This discount has expired');
            } else {
              console.log(err);
              $scope.promoErr = err;
            }
          })
      };

      $scope.$on('userChange', function () {
        init();
        $scope.$digest();
      });

      $scope.downloadDesignPDF = function (design) {
        return DownloadPDF.forWheelchairs(design)
        .catch(function (err) {
          alert('Failed to download Wheelchair PDF');
        });
      };


    }]);

