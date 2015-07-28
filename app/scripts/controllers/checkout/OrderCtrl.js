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
  .controller('OrderCtrl', ['$scope', '$location', '$http', 'User', 'FrameData', 'Bank', 'Drop',
    function ($scope, $location, $http, User, FrameData, Bank, Drop) {

      /*************************** CONTROL VARIABLES *************************/

      Drop.setFalse();

      $scope.stages = {
        INFO: 0,
        PAYMENT: 1,
        CONFIRM: 2,
        COMPLETE: 3
      };

      $scope.curStage = $scope.stages.INFO;


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
          button: "GO TO MY ORDER >>"
        }
      ];

      /*************************** LOADING CUREDITORDER ****************************/

      $scope.curOrder = User.getCurEditOrder();

      //Send user to My Designs if orders page reached without having an unsent order
      if ($scope.curOrder === null) {
        $location.path('\cart');
        return;
      }
      else if ($scope.curOrder.getNumWheelchairs() === 0) {
        $location.path('\cart');
        return;
      }

      /**************************** WHEELCHAIRS ************************************/

      $scope.wheelchairs = $scope.curOrder.getWheelchairs();

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

      //Advance to the next stage of checkout
      $scope.next = function () {
        switch ($scope.curStage) {

          case $scope.stages.INFO:
            if (allInputsFilled() === false) {
              alert('You must fill in all contact information');
              return;
            }
            $scope.curStage++;
            break;


          case $scope.stages.PAYMENT:
            if($scope.payForm.method === $scope.payMethods.PAYPAL) {
              payment();
            }
            else
              $scope.curStage++;
            break;


          case $scope.stages.CONFIRM:
            if (!$scope.termsForm.hasReadTerms) {
              alert("You must accept the Terms and Conditions to continue");
              return;
            }
            User.sendCurEditOrder($scope.contactForm, $scope.shippingForm, $scope.payForm.method, token)
              .then(function () {
                $scope.orderNum = $scope.curOrder.getOrderNum();
                if($scope.orderNum !== -1) {
                  $scope.curStage++;
                  User.updateCookie();
                }
              }, function () {
                alert('Error sending order');
              });
            break;


          case $scope.stages.COMPLETE:
            break;
        }
      };

      //Return the user to their cart
      $scope.returnToCart = function () {
        $location.path('/cart');
      };

      //Returns true if all inputs on INFO filled in (except addr2)
      function allInputsFilled() {
        var allFilled = true;
        allFilled = $scope.contactForm.fName !== '' ? allFilled : false;
        allFilled = $scope.contactForm.lName !== '' ? allFilled : false;
        allFilled = $scope.contactForm.email !== '' ? allFilled : false;
        allFilled = $scope.contactForm.phone !== '' ? allFilled : false;
        allFilled = $scope.shippingForm.addr !== '' ? allFilled : false;
        allFilled = $scope.shippingForm.city !== '' ? allFilled : false;
        allFilled = $scope.shippingForm.state !== '' ? allFilled : false;
        allFilled = $scope.shippingForm.zip !== '' ? allFilled : false;
        return allFilled;
      }

      /*************************** INFO ******************************/


        //Model for the contact form
        //Init'ed using User settings - does not change User values b/c they're primitives
      $scope.contactForm = {
        fName: User.getFname(),
        lName: User.getLname(),
        email: User.getEmail(),
        phone: User.getPhone()
      };

      //Model for the shipping form
      //Init'ed using User settings - does not change User values b/c they're primitives
      $scope.shippingForm = {
        addr: User.getAddr(),
        addr2: User.getAddr2(),
        city: User.getCity(),
        state: User.getState(),
        zip: User.getZip()
      };

      /**************************** PAYMENT ******************************/

        //Payment Method radio buttons
      $scope.payMethods = {
        PAYPAL: 'paypal',
        ADVANCE: 'advance'
      };

      //User's choice of payment method
      $scope.payForm = {
        method: $scope.payMethods.ADVANCE
      };

      $scope.bankData = Bank;

      $scope.card = {
        number: '',
        cvc: '',
        exp_month: '',
        exp_year: ''
      };

      $scope.payment_errors = '';


      var token = '';
      function payment(){
        console.log($scope.card);
        Stripe.card.createToken($scope.card, stripeResponseHandler);
      }

      function stripeResponseHandler(status, response) {
        if (response.error) {
          // Show the errors on the form
          $scope.payment_errors = response.error.message;
          console.log(response.error.message);
        } else {
          // response contains id and card, which contains additional card details
          token = response.id;
          console.log(token);
          $scope.$apply(function(){
            $scope.curStage++;
          });
        }
      }
      /**************************** CONFIRM ******************************/

        //T&C Checkbox model
      $scope.termsForm = {
        hasReadTerms: false
      };

      $scope.termsAndConditionsHTML = termsAndConditionsHTML;

      /**************************** COMPLETE *****************************/

        //The Number assigned to the user's order
      $scope.orderNum = "0000";

    }]);


//HTML code inserted into the Terms & Conditions box
var termsAndConditionsHTML = "The TINKER<sup>TM</sup> wheelchair customization system is designed and managed by IntelliWheels, Inc. " +
  "Intelliwheels acts only as a broker for your purchase with the manufacturer of the wheelchair. " +
  "By making a purchase with the TINKER<sup>TM</sup> system, you are agreeing to the terms and conditions of the manufacturer of the wheelchair. " +
  "IntelliWheels is not liable for any manufacturing defects, lead times, warrantee issues, or features of your new wheelchair that are different than expected. " +
  "When you place your order, the TINKER<sup>TM</sup> system will put you in touch with someone from that manufacturer and it is up to you and the" +
  " manufacturer to work out all of the details of your custom purchase.  " +
  "Check with the manufacturer to find out their return policy, and modification policy. ";
