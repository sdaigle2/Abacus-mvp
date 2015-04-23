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
    $scope.MeasurementTypes = {
      REAR_SEAT_HEIGHT : 'rearSeatHeight',
      REAR_SEAT_WIDTH : 'rearSeatWidth',
      FOLDING_BACKREST_HEIGHT : 'foldingBackrestHeight',
      AXEL_POSITION : 'axelPosition',
      SEAT_DEPTH : 'seatDepth'
    };

    //Navigational values
    var contentSection = $scope.ContentSection.ACCOUNT;
    var curMeasureType = $scope.MeasurementTypes.REAR_SEAT_HEIGHT;

    /***************** SIDEBAR BUTTONS ***************************************/

    $scope.edit = function () {
      switch (contentSection) {
        case $scope.ContentSection.ACCOUNT:
          //TODO: 
        case $scope.ContentSection.ORDERS:
          return;
        case $scope.ContentSection.MEASUREMENTS:
          //TODO: 
          break;
      }
    };


    $scope.save = function () {
      switch (contentSection) {
        case $scope.ContentSection.ACCOUNT:
          //TODO: 
        case $scope.ContentSection.ORDERS:
          return;
        case $scope.ContentSection.MEASUREMENTS:
          //TODO: 
          break;
      }
    };

    /***************** CONTENT SECTION SWITCHING *****************************/
    $scope.getContentSection = function () {
      return contentSection;
    };

    $scope.setContentSection = function (newContentSection) {
      $scope.resetMeasurementType();
      contentSection = newContentSection;
    };

    $scope.resetContentSection = function() {
      contentSection = $scope.ContentSection.ACCOUNT;
    }

    /***************** MEASUREMENT HELP SWITCHING *****************************/
    $scope.getMeasurementType = function () {
      return curMeasureType;
    };

    $scope.setMeasurementType = function (newMeasureType) {
      if (curMeasureType === newMeasureType)
        curMeasureType = '';
      else {
        curMeasureType = newMeasureType;
        $scope.imgIndex = 0;
      }
    };

    $scope.resetMeasurementType = function () {
      curMeasureType = "";
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
    $scope.measDisplay = {
      rearSeatHeight: {
        name: "Rear Seat Height",
        options: ["1", "2", "3"],
        optionSelected: null,
        desc: "Distance from the ground up to back corner of your seat",
        imgURLs: ["images/measure/rear-seat-height1.jpg", "images/measure/rear-seat-height2.jpg", "images/measure/rear-seat-height3.jpg"],
        imgIndex: 0
      },
      rearSeatWidth: {
        name: "Rear Seat Width",
        options: ["A", "B", "C"],
        optionSelected: null,
        desc: "The distance between armrests at the back of the seat",
        imgURLs: ["images/measure/rear-seat-height1.jpg", "images/measure/rear-seat-height2.jpg", "images/measure/rear-seat-height3.jpg"],
        imgIndex: 0
      },
      foldingBackrestHeight: {
        name: "Folding Backrest Height",
        options: ["Do", "Re", "Mi"],
        optionSelected: null,
        desc: "Distance from the seat to the top of the backrest",
        imgURLs: ["images/measure/rear-seat-height1.jpg", "images/measure/rear-seat-height2.jpg", "images/measure/rear-seat-height3.jpg"],
        imgIndex: 0
      },
      axelPosition: {
        name: "Axel Position",
        options: ["Uno", "Dos", "Tres"],
        optionSelected: null,
        desc: "The position of the axel",
        imgURLs: ["images/measure/rear-seat-height1.jpg", "images/measure/rear-seat-height2.jpg", "images/measure/rear-seat-height3.jpg"],
        imgIndex: 0
      },
      seatDepth: {
        name: "Seat Depth",
        options: ["I", "II", "III"],
        optionSelected: null,
        desc: "Distance from the back of the seat to the front",
        imgURLs: ["images/measure/rear-seat-height1.jpg", "images/measure/rear-seat-height2.jpg", "images/measure/rear-seat-height3.jpg"],
        imgIndex: 0
      }
    };

  });
