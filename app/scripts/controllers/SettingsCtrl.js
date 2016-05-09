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
  .controller('SettingsCtrl', ['$scope', '$location', '$http', 'User', 'Units', 'Drop', 'FrameData','WHEELCHAIR_CANVAS_WIDTH', 'UserData', '_',
    function ($scope, $location, $http, User, Units, Drop, FrameData, WHEELCHAIR_CANVAS_WIDTH, UserData, _) {
      Drop.setFalse();
      //Kick user off page if not logged in
      if (User.isLoggedIn() === false) {
        $location.path('/frames');
        return;
      }

      $scope.WHEELCHAIR_CANVAS_WIDTH = WHEELCHAIR_CANVAS_WIDTH;

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
        //MEASUREMENTS: 'measurements',
        MYDESIGNS: 'myDesigns'
      };

      //Categories inside the 'My Measurements' Section of the User
      // $scope.MeasurementTypes = {
      //   REAR_SEAT_HEIGHT: 'rearSeatHeight',
      //   REAR_SEAT_WIDTH: 'rearSeatWidth',
      //   FOLDING_BACKREST_HEIGHT: 'foldingBackrestHeight',
      //   AXEL_POSITION: 'axelPosition',
      //   SEAT_DEPTH: 'seatDepth'
      // };
      // var curMeasureType = $scope.MeasurementTypes.REAR_SEAT_HEIGHT;


      /***************** SIDEBAR BUTTONS ***************************************/

      $scope.saveMessage = 'SAVE >>';
      $scope.errMessage = '';
      $scope.save = function () {
        switch ($scope.getContentSection()) {
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
        return $location.search().section || $scope.ContentSection.ORDERS; // default to Orders page
      };
      $scope.setContentSection = function (newContentSection) {
        $location.search({
          'section': newContentSection
        });
      };

      $scope.resetContentSection = function () {
        $location.search({
          'section': $scope.ContentSection.ORDERS
        });
      };

      /***************** MEASUREMENT HELP SWITCHING *****************************/
      //$scope.getMeasurementType = function () {
      //  return curMeasureType;
      //};
      //
      //$scope.setMeasurementType = function (newMeasureType) {
      //  if (curMeasureType === newMeasureType) {
      //    curMeasureType = '';
      //  }
      //  else {
      //    curMeasureType = newMeasureType;
      //    $scope.imgIndex = 0;
      //  }
      //};
      //
      //$scope.resetMeasurementType = function () {
      //  curMeasureType = '';
      //};

      /***************** MY ACCOUNT *********************************************/


      /***************** MY ORDERS **********************************************/

        //Array of orders
        //TODO: needs to be integrated with the Order factory
      var orders = User.getSentOrders();
      $scope.orderWheelchairs = _.chain(User.getSentOrders())
      .map(function (order) {
        var chairs = _.map(order.wheelchairs, 'wheelchair');
        chairs = _.reject(chairs, _.isNull);

        return chairs.map(function (chair) {
          return {
            chair: chair,
            order: order
          };
        });
      })
      .flatten()
      .value();
      $scope.orderWheelchairs = _.orderBy($scope.orderWheelchairs, 'order.sentDate', 'desc');


      $scope.getChairFrame = function (chair) {
        var frameID = chair.frameID;
        return FrameData.getFrame(frameID);
      }

      $scope.openOrderDetails = function (index) {
        //TODO: Display order details from the User service
      };

      /***************** My designs *********************************************/

      // wheelchair in myDesigns
      $scope.wheelchairs = [];
      $scope.wheelchairUIOpts = []; //what does this variable do?
      $scope.parts = [];

      function init() {

        $scope.wheelchairs = User.getCartWheelchairs();    // return array of chair instance



        // download the parts in $scope.parts
        $scope.wheelchairs.forEach(function (wheelchair) {
          getParts(wheelchair.getFrameID());
        });

        // initialize the ui variables to a default value
        $scope.wheelchairUIOpts = $scope.wheelchairs.map(function () {
          return {
            'checked': false, // whether the checkbox in each cart item is marked
            'showInfo': false // whether to show the table of wheelchair parts
          };
        });
      }

      function getParts(fID) {
        var frame = FrameData.getFrame(fID);
        var parts = frame.getParts();
        for (var i = 0; i < parts.length; i++) {
          if (!inPartsArray(parts[i])) {
            $scope.parts.push(parts[i]);
          }
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


      /*************Item buttons*********/

      $scope.seeWheelchairDetails = function (index) {
        if ($scope.curDetailPanel == index)
          $scope.curDetailPanel = -1;
        else
          $scope.curDetailPanel = index;
      };

      //Sends the user back to abacus with the selected wheelchair
      $scope.editWheelchair = function (index) {
        User.setDesignedWheelchair(index, $scope.wOrderIndex[index]);
        $location.path('/tinker');
      };

      $scope.moveToCart = function (index) {
        alert('TODO: moveToCart implementation');
      };

      $scope.deleteWheelchair = function (index) {

        //$scope.wOrderIndex.splice(index, 1);
        $scope.wheelchairUIOpts.splice(index, 1);
        //
        ////Remove wheelchair from My Designs
        User.deleteWheelchair(index);
      };



      /********Detail Panel****/


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

      $scope.downloadDesignPDF = function (design) {
        return DownloadPDF.forWheelchairs(design)
        .catch(function (err) {
          alert('Failed to download Wheelchair PDF');
        });
      };

      init();

      $scope.$on('$destroy', function() {
        var curSearch = $location.search();
        delete curSearch.section; // remove the section query param
        $location.search(curSearch);
      });


      //Options for each measure - Can be called using $scope.measOptions['rearSeatHeight'] to take advantage of enum



    //      var rearSeatH = FrameData.getFrameByID(1).measures[3];
    //      var rearSeatW = FrameData.getFrameByID(1).measures[0];
    //      var backrestH = FrameData.getFrameByID(1).measures[2];
    //      var seatD = FrameData.getFrameByID(1).measures[1];
    //      //console.log(rearSeatH);
    //      //console.log(rearSeatW);
    //      //console.log(backrestH);
    //      //console.log(seatD);
    //      $scope.measDisplay = {
    //        rearSeatHeight: {
    //          name: rearSeatH.name,
    //          options: rearSeatH.measureOptions[1],
    //          optionSelected: User.commonMeasures.REAR_SEAT_HEIGHT,
    //          desc: rearSeatH.desc,
    //          imgURLs: rearSeatH.imageURLs,
    //          imgIndex: 0
    //        },
    //        rearSeatWidth: {
    //          name:rearSeatW.name,
    //          options: rearSeatW.measureOptions[1],
    //          optionSelected: User.commonMeasures.REAR_SEAT_WIDTH,
    //          desc: rearSeatW.desc,
    //          imgURLs: rearSeatW.imageURLs,
    //          imgIndex: 0
    //        },
    //        foldingBackrestHeight: {
    //          name: backrestH.name,
    //          options: backrestH.measureOptions[1],
    //          optionSelected: User.commonMeasures.FOLDING_BACKREST_HEIGHT,
    //          desc: backrestH.desc,
    //          imgURLs: backrestH.imageURLs,
    //          imgIndex: 0
    //        },
    //        axelPosition: {
    //          name: 'Axel Position',
    //          options: ['Uno', 'Dos', 'Tres'],
    //          optionSelected: User.commonMeasures.AXEL_POSITION,
    //          desc: 'The position of the axel',
    //          imgURLs: ['images/measure/rear-seat-height1.jpg', 'images/measure/rear-seat-height2.jpg', 'images/measure/rear-seat-height3.jpg'],
    //          imgIndex: 0
    //        },
    //        seatDepth: {
    //          name: seatD.name,
    //          options: seatD.measureOptions[1],
    //          optionSelected: User.commonMeasures.SEAT_DEPTH,
    //          desc: seatD.desc,
    //          imgURLs: seatD.imageURLs,
    //          imgIndex: 0
    //        }
    //      };
    //
    //  $scope.curUnitSys = User.getUnitSys();
    //
    //  $scope.unitSysList = [
    //    {
    //      name: 'Metric',
    //      enumVal: Units.unitSys.METRIC
    //    },
    //    {
    //      name: 'Imperial',
    //      enumVal: Units.unitSys.IMPERIAL
    //    }];
    //
    }]);
