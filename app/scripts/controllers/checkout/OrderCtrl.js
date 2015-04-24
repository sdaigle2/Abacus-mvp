// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:OrderCtrl
 * @description
 * # OrderCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('OrderCtrl',  function ($scope, $location,orderFactory,userService) {

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

    //database action
    orderFactory.all()
      .success(function(data){
        $scope.info = data;
        console.log(JSON.stringify(data ));
      })
      .error(function(data) {
      console.log("Request failed: " + data);
      });

    $scope.user = userService.all()
      .success(function(data){
        $scope.user = data;
        console.log(JSON.stringify(data ));
      })
      .error(function(data) {
          console.log("Request failed: " + data);
      });





    /*************************** SIDEBAR BUTTONS ************************/

    //Return to the previous stage of checkout
    $scope.back = function () {
      switch ($scope.curStage) {
        case $scope.stages.INFO:
          //TODO: Implement this
          //If guest, return to 'checkout'
          $location.path('/checkout');
          //If logged in, return to 'cart'
          //$location.path('/cart');
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
          //TODO: Verify inputs to contactForm and shippingForm
          alert(JSON.stringify($scope.contactForm));
          alert(JSON.stringify($scope.shippingForm));

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
          //TODO: Send the order
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

    /*************************** INFO ******************************/



    //Model for the contact form
    $scope.contactForm = {
      fName: "",
      lName: "",
      email: "",
      phone: ""
    };

    //Model for the shipping form
    $scope.shippingForm = {
      addr: "",
      addr2: "",
      city: "",
      state: "",
      zip: ""
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

    /**************************** CONFIRM ******************************/

    //T&C Checkbox model
    $scope.termsForm = {
      hasReadTerms: false
    };


    $scope.wheelchairs = cartDataFromDB; //TODO: curWheelchair?
    $scope.frameData = frameDataFromDB;

    //Get data for curWheelchair.Part object
    $scope.getPartDetails = function (wheelchairPart) {
      var part = getPartData(wheelchairPart.partID);
      var option = getOptionData(wheelchairPart.optionID, part);
      var colorName = "";
      if (option.colors.length > 0)
        colorName = getColorByID(wheelchairPart.colorID, option).name;
      var priceString = (option.price < 0) ? "-$" : "$";
      priceString += Math.abs(option.price).toFixed(2);
      return {
        partName: part.name,
        optionName: option.name,
        colorName: colorName,
        priceString: priceString
      };
    };

    //Get data for curWheelchair.Measure object
    $scope.getMeasureDetails = function (wheelchairMeasure) {
      var i = wheelchairMeasure.measureOptionIndex;
      var meas = getMeasureData(wheelchairMeasure.measureID);
      var measOption = "NOT SELECTED";
      var measPrice = "$0.00";
      if (wheelchairMeasure.measureOptionIndex != -1) {
        measOption = meas.measureOptions[1][i];  //TODO: Set up imperial/metric toggle
        measOption += " " + meas.units[1]; //Here too
        measPrice = ((meas.prices[i] < 0) ? "-$" : "$") + Math.abs(meas.prices[i]).toFixed(2);
      }
      return {
        name: meas.name,
        option: measOption,
        price: measPrice
      }
    };

    function getPartData(id) {
      for (var i = 0; i < $scope.frameData.parts.length; i++) {
        var curPart = $scope.frameData.parts[i];
        if (curPart.partID === id) {
          return curPart;
        }
      }
      return null;
    }

    function getOptionData(id, curPart) {

      for (var j = 0; j < curPart.options.length; j++) {
        var curOption = curPart.options[j];
        if (curOption.optionID === id) {
          return curOption;
        }
      }

      return null;
    }

    function getMeasureData(id) {
      for (var i = 0; i < $scope.frameData.measures.length; i++) {
        var curMeas = $scope.frameData.measures[i];
        if (curMeas.measureID === id) {
          return curMeas;
        }
      }
      return null;
    }

    function getColorByID(colorID, curOption) {
      for (var i = 0; i < curOption.colors.length; i++) {
        if (curOption.colors[i].colorID === colorID) {
          return curOption.colors[i];
        }
      }
    };

    $scope.termsAndConditionsHTML = termsAndConditionsHTML;

    /**************************** COMPLETE *****************************/

    //The Number assigned to the user's order
    $scope.orderNum = "0000";

  });


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
