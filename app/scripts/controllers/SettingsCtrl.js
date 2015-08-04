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
  .controller('SettingsCtrl', ['$scope', '$location', '$http', 'User', 'Units', 'Drop',
    function ($scope, $location, $http, User, Units, Drop) {
      Drop.setFalse();
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
        phone: User.getPhone(),
        addr: User.getAddr(),
        addr2: User.getAddr2(),
        city: User.getCity(),
        state: User.getState(),
        zip: User.getZip(),
        oldPass: '',
        newPass1: '',
        newPass2: '',
        orders: User.getSentOrders()
      };

      //Sidebar options
      $scope.ContentSection = {
        ACCOUNT: 'account',
        ORDERS: 'orders',
        MEASUREMENTS: 'measurements'
      };

      //Categories inside the 'My Measurements' Section of the User
      $scope.MeasurementTypes = {
        REAR_SEAT_HEIGHT: 'rearSeatHeight',
        REAR_SEAT_WIDTH: 'rearSeatWidth',
        FOLDING_BACKREST_HEIGHT: 'foldingBackrestHeight',
        //AXEL_POSITION: 'axelPosition',
        SEAT_DEPTH: 'seatDepth'
      };
      var curMeasureType = $scope.MeasurementTypes.REAR_SEAT_HEIGHT;


      /***************** SIDEBAR BUTTONS ***************************************/

      $scope.saveMessage = 'SAVE >>';
      $scope.errMessage = '';
      $scope.save = function () {
        switch (User.getContentSection()) {
          case $scope.ContentSection.ACCOUNT:
            $scope.saveMessage = 'SAVING ...';
            $http({
              url: '/update'
              , data: $scope.accountModel
              , method: 'POST'
            }).success(function (data) {
              User.setFname($scope.accountModel.fName);
              User.setLname($scope.accountModel.lName);
              User.setPhone($scope.accountModel.phone);
              User.setAddr($scope.accountModel.addr);
              User.setAddr2($scope.accountModel.addr2);
              User.setCity($scope.accountModel.city);
              User.setState($scope.accountModel.state);
              User.setZip($scope.accountModel.zip);
              $scope.accountModel.oldPass = '';
              $scope.accountModel.newPass1 = '';
              $scope.accountModel.newPass2 = '';
              $scope.saveMessage = 'SAVED';
              $scope.errMessage = data.message;
              setTimeout(function(){$scope.$apply($scope.saveMessage = 'SAVE >>'); $scope.$apply($scope.errMessage = '')},3000);
            });
            break;

          case $scope.ContentSection.ORDERS:
            break;

          case $scope.ContentSection.MEASUREMENTS:
            User.commonMeasures.REAR_SEAT_HEIGHT = $scope.measDisplay.rearSeatHeight.optionSelected;
            User.commonMeasures.REAR_SEAT_WIDTH = $scope.measDisplay.rearSeatWidth.optionSelected;
            User.commonMeasures.FOLDING_BACKREST_HEIGHT = $scope.measDisplay.foldingBackrestHeight.optionSelected;
            //User.commonMeasures.AXEL_POSITION = $scope.measDisplay.axelPosition.optionSelected;
            User.commonMeasures.SEAT_DEPTH = $scope.measDisplay.seatDepth.optionSelected;

            User.setUnitSys($scope.curUnitSys);

            break;
        }
      };

      /***************** CONTENT SECTION SWITCHING *****************************/
      $scope.getContentSection = function () {
        return User.getContentSection();
      };
      $scope.setContentSection = function (newContentSection) {
        $scope.resetMeasurementType();
        User.setContentSection(newContentSection);
      };

      $scope.resetContentSection = function () {
        User.setContentSection($scope.ContentSection.ORDERS);
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
        //TODO: needs to be integrated with the Order factory
      var orders = User.getSentOrders();

      $scope.wheelchairs = [];
      for(var i=0; i<orders.length; i++){
        var wheelchairs = orders[i].getWheelchairs();
        for(var j=0; j<wheelchairs.length; j++){
          wheelchairs[j].orderNum = orders[i].orderNum;
          wheelchairs[j].date = orders[i].getSentDate();
          wheelchairs[j].fName = orders[i].getFname();
          wheelchairs[j].lName = orders[i].getLname();
          $scope.wheelchairs.push(wheelchairs[j]);
        }
      }

      $scope.openOrderDetails = function (index) {
        //TODO: Display order details from the User service
      };

      /***************** MY MEASURES *********************************************/

        //Options for each measure - Can be called using $scope.measOptions['rearSeatHeight'] to take advantage of enum

      $.getJSON("../../../data/frameData.json", function(json) {
          
          var frameData = json[1].measures;
          console.log(frameData);
          $scope.measDisplay = {  
            rearSeatHeight: {
              name: frameData[3].name,
              options: frameData[3].measureOptions[1],
              optionSelected: User.commonMeasures.REAR_SEAT_HEIGHT,
              desc: frameData[3].desc,
              imgURLs: frameData[3].imageURLs,
              imgIndex: 0
            },
            rearSeatWidth: {
              name: frameData[0].name,
              options: frameData[0].measureOptions[1],
              optionSelected: User.commonMeasures.REAR_SEAT_WIDTH,
              desc: frameData[0].desc,
              imgURLs: frameData[0].imageURLs,
              imgIndex: 0
            },
            foldingBackrestHeight: {
              name: frameData[2].name,
              options: frameData[2].measureOptions[1],
              optionSelected: User.commonMeasures.FOLDING_BACKREST_HEIGHT,
              desc: frameData[2].desc,
              imgURLs: frameData[2].imageURLs,
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
              name: frameData[1].name,
              options: frameData[1].measureOptions[1],
              optionSelected: User.commonMeasures.SEAT_DEPTH,
              desc: frameData[1].desc,
              imgURLs: frameData[1].imageURLs,
              imgIndex: 0
            }
          };
      });
      $scope.curUnitSys = User.getUnitSys();

      $scope.unitSysList = [
        {
          name: 'Metric',
          enumVal: Units.unitSys.METRIC
        },
        {
          name: 'Imperial',
          enumVal: Units.unitSys.IMPERIAL
        }];

    }]);
