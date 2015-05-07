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
  .controller('OrderCtrl', ['$scope', '$location', 'User', 'FrameData', 'Bank',
    function ($scope, $location, User, FrameData, Bank) {

    /*************************** CONTROL VARIABLES *************************/
    $scope.stages = {
      INFO: 0,
      PAYMENT: 1,
      CONFIRM: 2,
      COMPLETE: 3
    };

    $scope.curStage = $scope.stages.INFO;


    $scope.display = [
      { //INFO
        title: "YOUR INFO",
        button: "PAYMENT >"
      },
      { //PAYMENT
        title: "PAYMENT",
        button: "CONFIRM >"
      },
      { //CONFIRM
        title: "ORDER CONFIRMATION",
        button: "COMPLETE >"
      },
      { //COMPLETE
        title: "COMPLETE",
        button: "GO TO MY ORDER >>"
      }
    ];

    /*************************** WHEELCHAIRS ****************************/

    $scope.curOrder = User.getCurEditOrder();
    $scope.wheelchairs = $scope.curOrder.getWheelchairs();

    $scope.getFrame = function (fID) {
      return FrameData.getFrame(fID);
    };

    $scope.getPartDetails = function (wheelchair, part) {
      return wheelchair.getPartDetails(part.partID, User.unitSys);
    };

    $scope.getMeasureDetails = function (wheelchair, measure) {
      return wheelchair.getMeasureDetails(measure.measureID, User.unitSys);
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

    //Advance to the next stage of checkout (Payment)
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
          alert(JSON.stringify($scope.payForm.method));
          $scope.curStage++;
          break;
        case $scope.stages.CONFIRM:
          if (!$scope.termsForm.hasReadTerms) {
            alert("You must accept the Terms and Conditions to continue");
            return;
          }
          sendOrder();
          $scope.curStage++;
          break;
        case $scope.stages.COMPLETE:
          //TODO: Send user to "orders" page (Settings-MyOrders?)
          alert("YAY!");
          break;
      }
    };

    //Return the user to their cart
    $scope.returnToCart = function () {
      $location.path('/cart');
    };

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
    };

    function sendOrder() {
      $scope.orderNum = User.sendCurEditOrder($scope.contactForm, $scope.shippingForm, $scope.payForm.method);
    };

    /*************************** INFO ******************************/


    //Model for the contact form
    //Init'ed using User settings - does not change User values b/c they're primitives
    $scope.contactForm = {
      fName: User.fName,
      lName: User.lName,
      email: User.email,
      phone: User.phone
    };

    //Model for the shipping form
    //Init'ed using User settings - does not change User values b/c they're primitives
    $scope.shippingForm = {
      addr: User.addr,
      addr2: User.addr2,
      city: User.city,
      state: User.state,
      zip: User.zip
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


var termsAndConditionsHTML = "By agreeing to the following terms and conditions, you (hereby referred to as WHEELCHAIREE) give up the \
following rights to Intelliwheels (hereby referred to as WHEELCHAIRER):<br /> \
1) WHEELCHAIREE agrees that all information provided on this page has been verified, and any mistakes \
contained on this page are not the fault of WHEELCHAIRER.  Any problems and inconvieniences caused by \
these errors are the fault of WHEELCHAIREE.<br /> \
2) Any sock worn on WHEELCHAIREE's left foot while using the product must not be brown.  WHEELCHAIREE \
agrees to follow this rule, with punishments for being caught include up to 3 years of imprisonment, as \
well as being stalked and harassed on social media for up to 6 months.<br /> \
3) Reading this paragraph voids all future complaints WHEELCHAIREE may have with regards to this agreement.  This \
includes all provisions outlined in sections 2.<br /> \
Thank you for deciding to purchase a wheelchair through the Intelliwheels Abacus system.  Have a nice day \
and remember to watch your future clothing decisions.";
