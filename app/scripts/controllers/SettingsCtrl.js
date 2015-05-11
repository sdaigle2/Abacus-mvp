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
  .controller('SettingsCtrl', ['$scope', 'User',
    function ($scope, User) {

    //Kick user off page if not logged in
    if (User.isLoggedIn() === false) {
      $location.path('/frames');
      return;
    }

    //Model for the 'My Account' inputs
    $scope.accountModel = {
      fName: User.getFname(),
      lName: User.getLname(),
      email: User.getEmail(),
      addr: User.getAddr(),
      addr2: User.getAddr2(),
      city: User.getCity(),
      state: User.getState(),
      zip: User.getZip(),
      oldPass: '',
      newPass1: '',
      newPass2: ''
    };
    //Sidebar options
    $scope.ContentSection = {
      ACCOUNT : 'account',
      ORDERS : 'orders',
      MEASUREMENTS : 'measurements'
    };

    //Categories inside the 'My Measurements' Section of the User
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

    //TODO: What does this button do?
    $scope.edit = function () {
      switch (contentSection) {
        case $scope.ContentSection.ACCOUNT:
          return;
        case $scope.ContentSection.ORDERS:
          return;
        case $scope.ContentSection.MEASUREMENTS:
          return;
      }
    };


    $scope.save = function () {
      switch (contentSection) {
        case $scope.ContentSection.ACCOUNT:

          User.fName = $scope.accountModel.fName;
          User.lName = $scope.accountModel.lName;
          User.email = $scope.accountModel.email;
          User.addr = $scope.accountModel.addr;
          User.addr2 = $scope.accountModel.addr2;
          User.city = $scope.accountModel.city;
          User.state = $scope.accountModel.state;
          User.zip = $scope.accountModel.zip;

          //TODO: update in the database (including password)

          break;

        case $scope.ContentSection.ORDERS:
          break;

        case $scope.ContentSection.MEASUREMENTS:
          User.commonMeasures.REAR_SEAT_HEIGHT = $scope.measDisplay.rearSeatHeight.optionSelected;
          User.commonMeasures.REAR_SEAT_WIDTH = $scope.measDisplay.rearSeatWidth.optionSelected;
          User.commonMeasures.FOLDING_BACKREST_HEIGHT = $scope.measDisplay.foldingBackrestHeight.optionSelected;
          User.commonMeasures.AXEL_POSITION = $scope.measDisplay.axelPosition.optionSelected;
          User.commonMeasures.SEAT_DEPTH = $scope.measDisplay.seatDepth.optionSelected;

          //TODO: update values in the database

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

    $scope.resetContentSection = function () {
      contentSection = $scope.ContentSection.ACCOUNT;
    };

    /***************** MEASUREMENT HELP SWITCHING *****************************/
    $scope.getMeasurementType = function () {
      return curMeasureType;
    };

    $scope.setMeasurementType = function (newMeasureType) {
      if (curMeasureType === newMeasureType) {
        curMeasureType = '';
      }
      else {
        curMeasureType = newMeasureType;
        $scope.imgIndex = 0;
      }
    };

    $scope.resetMeasurementType = function () {
      curMeasureType = '';
    };

    /***************** MY ACCOUNT *********************************************/



    /***************** MY ORDERS **********************************************/

    //Array of orders
    //TODO needs to be integrated with the Order factory
    $scope.orders = [{
      orderNum: '0000',
      datePlaced: new Date(2015, 1, 15, 7, 30, 0, 0),
      cart: {
        //Various cart fields
        totalPrice: 3721.90
      }
    },
    {
      orderNum: '0001',
      datePlaced: new Date(2015, 1, 15, 8, 15, 0, 0),
      cart: {
        //Various cart fields
        totalPrice: 9721.90
      }
    }];

    $scope.openOrderDetails = function (index) {
      //TODO: Display order details from the User service
    };

    /***************** MY MEASURES *********************************************/

    //Options for each measure - Can be called using $scope.measOptions['rearSeatHeight'] to take advantage of enum
    $scope.measDisplay = {
      rearSeatHeight: {
        name: 'Rear Seat Height',
        options: ['1', '2', '3'],
        optionSelected: User.commonMeasures.REAR_SEAT_HEIGHT,
        desc: 'Distance from the ground up to back corner of your seat',
        imgURLs: ['images/measure/rear-seat-height1.jpg', 'images/measure/rear-seat-height2.jpg', 'images/measure/rear-seat-height3.jpg'],
        imgIndex: 0
      },
      rearSeatWidth: {
        name: 'Rear Seat Width',
        options: ['A', 'B', 'C'],
        optionSelected: User.commonMeasures.REAR_SEAT_WIDTH,
        desc: 'The distance between armrests at the back of the seat',
        imgURLs: ['images/measure/rear-seat-height1.jpg', 'images/measure/rear-seat-height2.jpg', 'images/measure/rear-seat-height3.jpg'],
        imgIndex: 0
      },
      foldingBackrestHeight: {
        name: 'Folding Backrest Height',
        options: ['Do', 'Re', 'Mi'],
        optionSelected: User.commonMeasures.FOLDING_BACKREST_HEIGHT,
        desc: 'Distance from the seat to the top of the backrest',
        imgURLs: ['images/measure/rear-seat-height1.jpg', 'images/measure/rear-seat-height2.jpg', 'images/measure/rear-seat-height3.jpg'],
        imgIndex: 0
      },
      axelPosition: {
        name: 'Axel Position',
        options: ['Uno', 'Dos', 'Tres'],
        optionSelected: User.commonMeasures.AXEL_POSITION,
        desc: 'The position of the axel',
        imgURLs: ['images/measure/rear-seat-height1.jpg', 'images/measure/rear-seat-height2.jpg', 'images/measure/rear-seat-height3.jpg'],
        imgIndex: 0
      },
      seatDepth: {
        name: 'Seat Depth',
        options: ['I', 'II', 'III'],
        optionSelected: User.commonMeasures.SEAT_DEPTH,
        desc: 'Distance from the back of the seat to the front',
        imgURLs: ['images/measure/rear-seat-height1.jpg', 'images/measure/rear-seat-height2.jpg', 'images/measure/rear-seat-height3.jpg'],
        imgIndex: 0
      }
    };

  }]);
