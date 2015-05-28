// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:InvoiceCtrl
 * @description
 * # InvoiceCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('InvoiceCtrl', ['$scope', '$location', 'User', 'FrameData', 'Angles', 'Units', 'Costs', function ($scope, $location, User, FrameData, Angles, Units, Costs) {
    var order = User.getLastOrder();
    $scope.name = User.getFullName();
    $scope.wheelchairs = order.getWheelchairs();
    $scope.orderNum = order.getOrderNum();
    $scope.topImageSets = [];
    $scope.midImageSets = [];
    $scope.botImageSets = [];
    $scope.measurements = [];
    $scope.date = order.getSentDate().toDateString();
    $scope.address = order.getFormattedAddr();
    $scope.subtotal = 0;
    $scope.shipping = Costs.SHIPPING_FEE;
    $scope.taxrate = (Costs.TAX_RATE*100).toFixed(2);
    $scope.frameParts = [];
    $scope.wheelParts = [];

    function getFrame(wheelchair){
      var frameID = wheelchair.getFrameID();
      return FrameData.getFrame(frameID);
    }

    function getImageSets(){
      for(var i=0; i<$scope.wheelchairs.length; i++){
        $scope.topImageSets.push($scope.wheelchairs[i].getPreviewImages(Angles.angleType.BACKRIGHT));
        $scope.midImageSets.push($scope.wheelchairs[i].getPreviewImages(Angles.angleType.FRONTRIGHT));
        $scope.botImageSets.push($scope.wheelchairs[i].getPreviewImages(Angles.angleType.RIGHT));
      }
    }

    function getMeasurements(){
      for(var i=0; i<$scope.wheelchairs.length; i++){
        var measures = $scope.wheelchairs[i].getMeasures();
        var newMeasures = [];
        for(var j=0; j<measures.length; j++){
          var newMeasure = $scope.wheelchairs[i].getMeasureDetails(measures[j].measureID, Units.unitSys.IMPERIAL);
          newMeasures.push(newMeasure);
        }
        $scope.measurements.push(newMeasures);
      }
    }

    function getSubtotal() {
      for(var i=0; i<$scope.wheelchairs.length; i++){
        $scope.subtotal += $scope.wheelchairs[i].getTotalPrice();
      }
      $scope.subtotal = $scope.subtotal.toFixed(2);
    }

    function getFrameParts() {
      for(var i=0; i<$scope.wheelchairs.length; i++){
        var frame = getFrame($scope.wheelchairs[i]);
        var customizeDetails = [];
        for(var j=0; j<frame.getWheelIndex(); j++){
          var partDetails = $scope.wheelchairs[i].getPartDetails(frame.getPartByIndex(j).getID(), 0);
          customizeDetails.push(partDetails);
        }
        $scope.frameParts.push(customizeDetails);
      }
    }

    function getWheelParts() {
      for(var i=0; i<$scope.wheelchairs.length; i++){
        var frame = getFrame($scope.wheelchairs[i]);
        var customizeDetails = [];
        for(var j=frame.getWheelIndex(); j<frame.getNumParts(); j++){
          var partDetails = $scope.wheelchairs[i].getPartDetails(frame.getPartByIndex(j).getID(), 0);
          customizeDetails.push(partDetails);
        }
        $scope.wheelParts.push(customizeDetails);
      }
    }

    getImageSets();
    getMeasurements();
    getSubtotal();
    getFrameParts();
    getWheelParts();

    $scope.tax = ($scope.taxrate * $scope.subtotal / 100).toFixed(2);
    $scope.total = parseFloat($scope.subtotal) + parseFloat($scope.shipping) + parseFloat($scope.tax) - 23;

    $scope.getManufacturer = function(wheelchair){
      var frame = getFrame(wheelchair);
      return frame.getManufacturer();
    };

    $scope.getBasePrice = function(wheelchair){
      var frame = getFrame(wheelchair);
      return '$'+frame.getBasePrice();
    };

    $scope.getModel = function(wheelchair){
      var frame = getFrame(wheelchair);
      return frame.getName();
    };

    $scope.getBaseWeight = function(wheelchair){
      var frame = getFrame(wheelchair);
      return frame.getBaseWeight()+'lb';
    };

  }]);
