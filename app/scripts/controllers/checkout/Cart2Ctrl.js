// jshint unused:false

'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the abacuApp
 * make sure to update compare module with every action on the cart
 */
angular.module('abacuApp')
  .constant('WHEELCHAIR_CANVAS_WIDTH', 187) // width of canvas that renders wheelchair
  .constant('PAYMENT_METHODS', [
    {
      'name': 'Pay total now'
    }, 
    {
      'name': 'Pay part now, pay remainder when order ships',
      'message': 'WARNING: you can pay any amount that you want now, but we won’t start building your chair until we have at least a 50% down payment.'
    }, 
    {
      'name': 'Pay later',
      'message': 'Thank you for making a down payment of at least 50%. We’ll get to work building your chair, but we won’t ship it until we receive the full payment.'
   }])
  .constant('PAYMENT_TYPES', [
    {
      'name': 'Credit Card', 
      'requiresAccount': false
    }, 
    {
      'name': 'Cash',
      'requiresAdmin': true
    }, 
    {
      'name': 'Check', 
      'requiresAdmin': true
   }])
  .controller('Cart2Ctrl', ['$scope', '$location', 'localJSONStorage', 'User', '_', 'ComparedDesigns', 'MAX_COMPARISON_CHAIRS', 'FrameData', 'Units', 'Wheelchair', 'Drop', 'WHEELCHAIR_CANVAS_WIDTH', 'Design', 'USER_TYPES', 'PAYMENT_METHODS', 'PAYMENT_TYPES',
    '$q', 'Errors', 'ngDialog', 'PromiseUtils', 'Discount', '$http', 'DownloadPDF',
    function ($scope, $location, localJSONStorage, User, _, ComparedDesigns, MAX_COMPARISON_CHAIRS, FrameData, Units, Wheelchair, Drop, WHEELCHAIR_CANVAS_WIDTH, Design, USER_TYPES, PAYMENT_METHODS, PAYMENT_TYPES, $q, Errors, ngDialog, PromiseUtils, Discount, $http, DownloadPDF) {
      $scope.WHEELCHAIR_CANVAS_WIDTH = WHEELCHAIR_CANVAS_WIDTH;
      $scope.USER_TYPES = USER_TYPES;
      $scope.PAYMENT_METHODS = PAYMENT_METHODS;
      $scope.PAYMENT_TYPES = PAYMENT_TYPES;

      //user login dropdown
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
      $scope.discount = {code: ""};

      //error message for promotion code
      $scope.promoErr = "";
      $scope.totalGrantAmount = 0;

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

        $scope.filteredWheelchairUIOpts = _.cloneDeep($scope.wheelchairUIOpts);
        _.reverse($scope.filteredWheelchairUIOpts);
        $scope.totalGrantAmount = _.sumBy($scope.curOrder.wheelchairs, function(o) {
          return parseInt(o.wheelchair.grantAmount);
        });
        
        $scope.curOrder.totalDueNow = calculateAmountToPay($scope.curOrder.getTotalCost());
        $scope.invalidValue = false;

        $scope.$watch('curOrder.totalDueNow', function(n, o){
          $scope.dueLater = ($scope.curOrder.getTotalCost() - $scope.curOrder.totalDueNow).toFixed(2);
          if (n > $scope.curOrder.getTotalCost() || n < 0) {
            $scope.invalidValue = true;
            $scope.dueLater = 0;
            $scope.curOrder.messageBox = `Please enter a number between 0 and ${$scope.curOrder.getTotalCost()}`;
          } else if (n < $scope.curOrder.getTotalCost() / 2 && n !== 0) {
            $scope.invalidValue = false;
            $scope.curOrder.messageBox = PAYMENT_METHODS[1].message;
            $scope.curOrder.payMethod = 'Pay part now';
          } else if (n >= $scope.curOrder.getTotalCost() / 2 && n < $scope.curOrder.getTotalCost()) {
            $scope.invalidValue = false;
            $scope.curOrder.payMethod = 'Pay part now';
            $scope.curOrder.messageBox = PAYMENT_METHODS[2].message;
          } else if (n === $scope.curOrder.getTotalCost()) {
            $scope.invalidValue = false;
            $scope.curOrder.payMethod = 'Pay total now';
            $scope.curOrder.messageBox = '';
          } else if (n === 0) {
            $scope.invalidValue = false;
            $scope.curOrder.messageBox = PAYMENT_METHODS[1].message;
            $scope.curOrder.payMethod = 'Pay later';
          }
        })
      }

      $scope.printValue = function(printval){
        console.log(printval);
      };

      function getParts(wheelchair){
        var frames = FrameData.getFrame(wheelchair.frameID);
        for (var i = 0; i < wheelchair.parts.length; i++) {
          $scope.parts.push(_.clone(wheelchair.parts[i]));
          $scope.parts[i].name = frames.getPart(wheelchair.parts[i].partID).getName();
          if(wheelchair.parts[i].optionID != -1) {
            $scope.parts[i].optionName = frames.getPart(wheelchair.parts[i].partID).getOption(wheelchair.parts[i].optionID).getName();
          }
        }
      }

      function calculateAmountToPay(total) {
        if ($scope.curOrder.payMethod === 'Pay part now') {
          $scope.messageBox = PAYMENT_METHODS[1].message;
          return total / 2;
        } else if ($scope.curOrder.payMethod === 'Pay later') {
          $scope.messageBox = PAYMENT_METHODS[2].message;
          return 0;
        } else if ($scope.curOrder.payMethod === 'Pay total now') {
          return total;
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

      function getItemIndex(id) {
        return _.findIndex($scope.wheelchairUIOpts, function(o) {
          return o.design._id == id;
        });
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
      $scope.editWheelchair = function (id) {
        var index = getItemIndex(id);
        if ($scope.wheelchairUIOpts[index].checked) {
          // if the item is checked, remove it from ComparedDesigns
          ComparedDesigns.cart.removeDesign($scope.wheelchairUIOpts[index].design);
        }

        User.setEditWheelchair(index, $scope.wheelchairUIOpts[index].design)
          .then(function () {
            $location.path('/tinker');
          });
      };

      // removes wheelchair from cart and puts it into the users wishlist
      $scope.moveToWishlist = function (id) {
        var index = getItemIndex(id);
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

      //Deletes wheelchair from user's My Designs
      $scope.deleteWheelchair = function (id) {
        var index = typeof id === 'number' ? id : getItemIndex(id);
        var design = $scope.wheelchairUIOpts[index].design;
        ComparedDesigns.cart.removeDesign(design);

        var grantPrice = $scope.wheelchairUIOpts[index].design.wheelchair.grantAmount
        if(typeof( grantPrice) != 0) {
          $scope.totalGrantAmount -= $scope.wheelchairUIOpts[index].design.wheelchair.grantAmount;
        }
        //$scope.wOrderIndex.splice(index, 1);
        $scope.wheelchairUIOpts.splice(index, 1);
        $scope.filteredWheelchairUIOpts = _.cloneDeep($scope.wheelchairUIOpts);
        _.reverse($scope.filteredWheelchairUIOpts);

          ////Remove wheelchair from cart
        return User.deleteWheelchair(index).then(function() {
          $scope.curOrder.totalDueNow = calculateAmountToPay($scope.curOrder.getTotalCost());
        });
      };

      //share function

      // Creates a design from the current wheelchair configuration and saves it in the DB (must be logged in)
      //
      function generateDesignIDForCurrentChair(index) {
        var design = User.getWheelchair(index);

        if (_.isNull(design)) {
          design = new Design({
            'creator': User.getID(),
            'wheelchair': User.getWheelchair(index).wheelchair
          });
        }

        design.wheelchair = User.getWheelchair(index).wheelchair;

        // If the design doesn't have an ID, generate one by saving it to the backend
        var designPromise = design.hasID() ? User.updateDesign(design) : User.saveDesign(design);

        return designPromise;
      }

      // share design function in tinker page
      $scope.shareDesignID = function (id) {
        var index = getItemIndex(id);
        generateDesignIDForCurrentChair(index)
          .then(function (design) {
            $scope.modalDesign = design;
            User.updateCartWheelchair(index,design);
            return ngDialog.open({
              'template': 'views/modals/designIDModal.html',
              'scope': $scope
            })
              .closePromise;
          })
          .then(function () {
            $scope.modalDesign = null;
            $scope.designIsSaved = true;
          })
          .catch(function (err) {
            if (err instanceof Errors.NotLoggedInError) {
              ngDialog.open({
                'template': 'views/modals/loginPromptModal.html'
              }).closePromise
                .then(function(){
                  return Drop.setTrue();
                });
            }
          });
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

      $scope.adminFiler = function(item) {
        if (item.requiresAdmin) {
          return User.getUserType() === 'admin' || User.getUserType() === 'superAdmin';
        }

        return true;
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
        var method = paymentMethod.name.split(' ', 3).join(" ").replace(/,/g, "");
        $scope.curOrder.payMethod = method;
        $scope.curOrder.totalDueNow = calculateAmountToPay($scope.curOrder.getTotalCost());
      };

      $scope.choosePaymentType = function (paymentType) {
        if (paymentType.requiresAccount) {
          $scope.showLoginModal()
          .then(function () {
            $scope.curOrder.payType = paymentType;
          });
        } else {
          $scope.curOrder.payType = paymentType;
        }
      };

      $scope.setChecker = function(payMethod, type) {
        var payMethodName = payMethod.split(' ', 3).join(" ").replace(/,/g, "");

        if (payMethodName === $scope.curOrder[type]) return true;
        return false;
      }

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

      $scope.toggleImageDisplay = function (id) {
        var index = getItemIndex(id);
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

        Discount.fetchDiscount($scope.discount.code.toLowerCase())
          .then(function(newDiscount){
            discount = newDiscount;
            $scope.curOrder.addDiscount(discount);
            $scope.curOrder.getTotalCost();
            $scope.promoErr = '';
            $scope.curOrder.totalDueNow = calculateAmountToPay($scope.curOrder.getTotalCost());
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
          });
        $scope.discount.code = '';
      };

      $scope.emptyDiscount = function() {
        $scope.curOrder.emptyDiscount();
        localJSONStorage.remove('promo')
        $scope.curOrder.totalDueNow = calculateAmountToPay($scope.curOrder.getTotalCost());
        return User.updateCart();
      };

      $scope.$on('userChange', function () {
        init();
        $scope.$digest();
      });

      $scope.downloadDesignPDF = function (design) {
        ngDialog.open({
          'template':'views/modals/pdfBeingGeneratedModal.html',
          'scope': $scope
        }).closePromise;
        return DownloadPDF.forWheelchairs(design)
        .catch(function (err) {
          alert('Failed to download Wheelchair PDF');
        });
      };


    }]);

