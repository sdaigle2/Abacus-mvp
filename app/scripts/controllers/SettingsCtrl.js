// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('SettingsCtrl', function ($scope, $location, sharedVars) {

    //Sidebar options
    $scope.ContentSection = {
      ACCOUNT : 'account',
      ORDERS : 'orders',
      MEASUREMENTS : 'measurements'
    };

    //Categories inside the 'My Measurements' Section
    $scope.MeasurementHelpSection = {
      NONE : '',
      REAR_SEAT_HEIGHT : 'rearSeatHeight',
      REAR_SEAT_WIDTH : 'rearSeatWidth',
      FOLDING_BACKREST_HEIGHT : 'foldingBackrestHeight',
      AXEL_POSITION : 'axelPosition',
      SEAT_DEPTH : 'seatDepth'
    };

    //Navigational values
    var contentSection = $scope.ContentSection.ACCOUNT;
    var measurementHelpSection = $scope.MeasurementHelpSection.REAR_SEAT_HEIGHT;


    /***************** CONTENT SECTION SWITCHING *****************************/
    $scope.getContentSection = function () {
      return contentSection;
    };

    $scope.setContentSection = function (newContentSection) {
      $scope.resetMeasurementHelpSection();
      contentSection = newContentSection;
    };

    $scope.resetContentSection = function() {
      contentSection = $scope.ContentSection.ACCOUNT;
    }

    /***************** MEASUREMENT HELP SWITCHING *****************************/
    $scope.getMeasurementHelpSection = function () {
      return measurementHelpSection;
    };

    $scope.setMeasurementHelpSection = function (newMeasurementHelpSection) {
      measurementHelpSection = newMeasurementHelpSection;
    };

    $scope.resetMeasurementHelpSection = function () {
      measurementHelpSection = $scope.MeasurementHelpSection.REAR_SEAT_HEIGHT;
    }

    /***************** MY ACCOUNT *********************************************/

    //Model for the 'My Account' inputs
    $scope.accountModel = {
      fName: "",
      lName: "",
      email: "",
      addr: "",
      addr2: "",
      city: "",
      state: "",
      zip: "",
      newPass1: "",
      newPass2: ""
    };

    /***************** MY ORDERS **********************************************/

    //Array of orders
    $scope.orders = [{
      orderNum: "0000",
      datePlaced: new Date(2015, 1, 15, 7, 30, 0, 0),
      cart: {
        //Various cart fields
        totalPrice: 3721.90
      }
    },
    {
      orderNum: "0001",
      datePlaced: new Date(2015, 1, 15, 8, 15, 0, 0),
      cart: {
        //Various cart fields
        totalPrice: 9721.90
      }
    }];

    $scope.openOrderDetails = function (index) {
      //TODO: Display order details
    };

    /***************** MY MEASURES *********************************************/

    //Options for each measure - Can be called using $scope.measOptions['rearSeatHeight'] to take advantage of enum
    $scope.measOptions = {
      rearSeatHeight: {
        name: "Rear Seat Height",
        options: ["1", "2", "3"],
        desc: "Distance from the ground up to back corner of your seat",
        imgURLs: []
      },
      rearSeatWidth: {
        name: "Rear Seat Height",
        options: ["1", "2", "3"],
        desc: "Distance from the ground up to back corner of your seat",
        imgURLs: []
      },
      foldingBackrestHeight: {
        name: "Rear Seat Height",
        options: ["1", "2", "3"],
        desc: "Distance from the ground up to back corner of your seat",
        imgURLs: []
      },
      axelPosition: {
        name: "Rear Seat Height",
        options: ["1", "2", "3"],
        desc: "Distance from the ground up to back corner of your seat",
        imgURLs: []
      },
      seatDepth: {
        name: "Rear Seat Height",
        options: ["1", "2", "3"],
        desc: "Distance from the ground up to back corner of your seat",
        imgURLs: []
      }
    };

  });
