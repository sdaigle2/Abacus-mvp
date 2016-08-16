// jshint unused:false
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:OrderCtrl
 * @description
 * # OrderCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('OrderCtrl', ['$scope', '$location', '$http', 'User', 'FrameData', 'Bank', 'Drop', '_',
    function ($scope, $location, $http, User, FrameData, Bank, Drop, _) {

      /*************************** CONTROL VARIABLES *************************/

      Drop.setFalse();

      $scope.completeClicked = false;

      // indicator of current section
      $scope.stages = {
        INFO: 0,
        PAYMENT: 1,
        CONFIRM: 2,
        COMPLETE: 3
      };

      //init page with user info section
      $scope.curStage = $scope.stages.INFO;


      // variable for button group on the right side
      $scope.display = [
        { //INFO
          title: "Your Info",
          button: "PAYMENT >"
        },
        { //PAYMENT
          title: "Payment",
          button: "CONFIRM >"
        },
        { //CONFIRM
          title: "Order Confirmation",
          button: "COMPLETE >"
        },
        { //COMPLETE
          title: "Complete",
          button: "GO TO MY ORDERS >>"
        }
      ];

      $scope.loggedIn = User.isLoggedIn();
      /*************************** LOADING CUREDITORDER ****************************/

      $scope.curOrder = User.getCurEditOrder();

      $scope.totalGrantAmount = _.sumBy($scope.curOrder.wheelchairs, function(o) {
        return parseInt(o.wheelchair.grantAmount);
      });


      //Send user to My Designs if orders page reached without having an unsent order
      if ($scope.curOrder === null) {
        $location.path('/cart');
        return;
      }
      else if ($scope.curOrder.getNumWheelchairs() === 0) {
        $location.path('/cart');
        return;
      }

      /**************************** WHEELCHAIRS ************************************/

      $scope.wheelchairs = _.map($scope.curOrder.getWheelchairs(), 'wheelchair');

      $scope.getFrame = function (fID) {
        return FrameData.getFrame(fID);
      };

      //Returns an object of display-friendly strings regarding the given part
      $scope.getPartDetails = function (wheelchair, part) {
        return wheelchair.getPartDetails(part.partID, User.getUnitSys());
      };

      //Returns an object of display-friendly strings regarding the given measure
      $scope.getMeasureDetails = function (wheelchair, measure) {
        return wheelchair.getMeasureDetails(measure.measureID, User.getUnitSys());
      };

      /*************************** SIDEBAR BUTTONS ************************/

        //Return to the previous stage of checkout
      $scope.back = function () {
        switch ($scope.curStage) {
          case $scope.stages.INFO:
            if (User.isLoggedIn())
              $location.path('/cart');
            else
              $location.path('/checkout');
            break;
          case $scope.stages.PAYMENT:
          case $scope.stages.CONFIRM:
          case $scope.stages.COMPLETE:
            $scope.curStage--;
            break;
        }
      };

      //Advance to the next stage of checkout, controll
      $scope.next = function () {

        switch ($scope.curStage) {

          case $scope.stages.INFO:
            $scope.completeClicked = false;
            //check if all field has been field
            if (allInputsFilled() === false) {
              alert('You must fill in all contact information');
              return;
            }
            // go on to next stage
            $scope.curStage++;
            break;


          case $scope.stages.PAYMENT:
            // disable complete button once it is clicked
            $scope.completeClicked = false;
            if (!allFormFieldsComplete($scope.billingForm, ['addr2'])) {
              alert('You must fill in all billing information');
              return;
            }
            //check if credit card info is required and check the info
            if ($scope.creditCardRequired() && !allFormFieldsComplete($scope.card)) {
              alert('Incomplete Credit Card Information');
              return;
            }

            if ($scope.creditCardRequired() && allFormFieldsComplete($scope.card)) {
              payment();
            } else if (!$scope.creditCardRequired()) {

              //go on to next stage
              $scope.curStage++;
            }

            break;


          case $scope.stages.CONFIRM:
            // check if user has agree to agreement
            if (!$scope.termsForm.hasReadTerms) {
              alert("You must accept the Terms and Conditions to continue");
              return;
            }

            // disable the complete button
            $scope.completeClicked = true;
            //sending the order
            User.sendCurEditOrder($scope.contactForm, $scope.shippingForm, $scope.billingForm, $scope.curOrder.payMethod, token)
              .then(function (response) {

                $scope.orderNum = response.orderNum;
                if($scope.orderNum !== -1) {
                  $scope.curStage++;
                  //resume the stage button
                  $scope.completeClicked = false;
                }
                // clean the item in the cart
                User.clearCart();
              })
              .catch(function () {
                alert('Error sending order');
              });
            break;


          case $scope.stages.COMPLETE:
            User.setContentSection('orders');
            $location.path('/settings');
            break;
        }
      };

      //Return the user to their cart
      $scope.returnToCart = function () {
        $location.path('/cart');
      };

      // Given a string, returns a new string with all the non-numerical chars gone
      // If arg isn't a string, output is just the input arg
      function retainNumberChars(str) {
        if (_.isString(str)) {
          return Array.prototype.slice.call(str)
            .filter(function (char) {
              // Only keep the chars that are numerical digits
              return char.charCodeAt(0) >= "0".charCodeAt(0) && char.charCodeAt(0) <= "9".charCodeAt(0);
            })
            .join('');
        }

        return str;
      }

      //Returns true if all inputs on INFO filled in (except addr2)
      function allInputsFilled() {
        var allFilled = true;
        allFilled = $scope.contactForm.email !== '' ? allFilled : false;
        allFilled = $scope.contactForm.phone !== '' ? allFilled : false;
        allFilled = $scope.shippingForm.addr !== '' ? allFilled : false;
        allFilled = $scope.shippingForm.city !== '' ? allFilled : false;
        allFilled = $scope.shippingForm.state !== '' ? allFilled : false;
        allFilled = $scope.shippingForm.zip !== '' ? allFilled : false;
        return allFilled;
      }

      function allFormFieldsComplete(form, optionalFields) {
        optionalFields = optionalFields || [];
        return _(form)
          .omit(optionalFields)
          .every(function (fieldValue) {
            return _.isString(fieldValue) && !_.isEmpty(fieldValue);
          });
      }

      $scope.register = function(){
        $location.path('/register');
      };
      /*************************** INFO ******************************/


        //Model for the contact form
        //Init'ed using User settings - does not change User values b/c they're primitives
      $scope.contactForm = {
        email: User.getEmail(),
        phone: User.getPhone()
      };

      //Model for the shipping form
      //Init'ed using User settings - does not change User values b/c they're primitives
      $scope.shippingForm = {
        fName: User.getFname(),
        lName: User.getLname(),
        addr: User.getAddr(),
        addr2: User.getAddr2(),
        city: User.getCity(),
        state: User.getState(),
        zip: User.getZip()
      };

      // Model for the order form AKA the billing address details
      // Init'ed using User settings - does not change User values b/c they're primitives
      $scope.billingForm = {
        fName: User.getFname(),
        lName: User.getLname(),
        addr: User.getAddr(),
        addr2: User.getAddr2(),
        city: User.getCity(),
        state: User.getState(),
        zip: User.getZip()
      };

      /**************************** PAYMENT ******************************/

      $scope.creditCardRequired = function () {
        return $scope.curOrder.payMethod === 'Credit Card';
      };

        //Payment Method radio buttons
      $scope.payMethods = $scope.curOrder.payMethod;

      //User's choice of payment method
      $scope.payForm = {
        method: $scope.payMethods.ADVANCE
      };

      $scope.bankData = Bank;

      $scope.card = {
        number: '',
        cvc: '',
        exp_month: '',
        exp_year: '',
      };



      $scope.payment_errors = '';


      var token = '';
      function payment(){
        // console.log($scope.card);
        Stripe.setPublishableKey('pk_live_KwYnVzZylrafo9Y0RTjZmcM1');
        //stripe api
        Stripe.card.createToken($scope.card, stripeResponseHandler);
      }
      
      function stripeResponseHandler(status, response) {
        if (response.error) {
          // Show the errors on the form
          $scope.payment_errors = response.error.message;
          alert(response.error.message);
          console.log('stripe created error: ' + response.error.message);
        } else {
          // response contains id and card, which contains additional card details
          token = response.id;
          console.log(token);
          $scope.$apply(function(){
            $scope.curStage++;
          });
        }
      }

      // function payment() {
      //   Stripe.tokens.create({
      //     card: {
      //       "number": $scope.card.number,
      //       "exp_month": $scope.card.exp_month,
      //       "exp_year": $scope.card.exp_year,
      //       "cvc": $scope.card.cvc
      //     }
      //   }, function (err, tokenIn) {
      //     // asynchronously called
      //     if (err) {
      //       $scope.payment_errors = response.error.message;
      //       console.log('stripe created error' + response.error.message);
      //     } else {
      //       token = tokenIn;
      //       console.log(token);
      //       $scope.$apply(function () {
      //         $scope.curStage++;
      //       });
      //     }
      //   });
      // }
      /**************************** CONFIRM ******************************/

        //T&C Checkbox model
      $scope.termsForm = {
        hasReadTerms: false
      };

      $scope.termsAndConditionsHTML = termsAndConditionsHTML;

      /**************************** COMPLETE *****************************/

        //The Number assigned to the user's order
        // it will be initialized later from cloudant
      $scope.orderNum = "0000";

      // Make sure that the zipcode field only has numbers in it
      $scope.$watch('shippingForm.zip', function (zip) {
        $scope.shippingForm.zip = retainNumberChars(zip);
      });

      // Make sure that the zipcode field only has numbers in it
      $scope.$watch('billingForm.zip', function (zip) {
        $scope.billingForm.zip = retainNumberChars(zip);
      });

      // Make sure you can only input numbers for the cards CVC, exp_month, & exp_year
      $scope.$watchCollection('card', function (card) {
        card.cvc = retainNumberChars(card.cvc);
        card.exp_month = retainNumberChars(card.exp_month);
        card.exp_year = retainNumberChars(card.exp_year);
      });

    }]);


//HTML code inserted into the Terms & Conditions box
var termsAndConditionsHTML = "The TINKER<sup>TM</sup> wheelchair customization system is designed and managed by IntelliWheels, Inc. " +
  "Intelliwheels acts only as a broker for your purchase with the manufacturer of the wheelchair. " +
  "By making a purchase with the TINKER<sup>TM</sup> system, you are agreeing to the terms and conditions of the manufacturer of the wheelchair. " +
  "IntelliWheels is not liable for any manufacturing defects, lead times, warrantee issues, or features of your new wheelchair that are different than expected. " +
  "When you place your order, the TINKER<sup>TM</sup> system will put you in touch with someone from that manufacturer and it is up to you and the" +
  " manufacturer to work out all of the details of your custom purchase.  " +
  "Check with the manufacturer to find out their return policy, and modification policy. ";
