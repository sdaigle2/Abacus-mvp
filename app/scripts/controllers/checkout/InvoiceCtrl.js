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
  .controller('InvoiceCtrl', ['$scope', '$location', 'User', 'FrameData', 'Angles', 'Units', function ($scope, $location, User, FrameData, Angles, Units) {
    var order = User.getLastOrder();
    $scope.name = User.getFullName();
    $scope.wheelchairs = order.getWheelchairs();
    $scope.orderNum = order.getOrderNum();
    $scope.topImageSets = [];
    $scope.midImageSets = [];
    $scope.botImageSets = [];
    $scope.wheelImageSets = [];
    $scope.frameImageSets = [];
    $scope.measurements = [];
    $scope.date = order.getSentDate().toDateString();
    $scope.address = order.getFormattedAddr();
    $scope.subtotal = order.getSubtotal().toFixed(2);
    $scope.shipping = order.getShippingCost().toFixed(2);
    $scope.taxrate = order.getTaxRate();
    $scope.tax = order.getTaxCost().toFixed(2);
    $scope.total = order.getTotalCost().toFixed(2);
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
        $scope.wheelImageSets.push($scope.wheelchairs[i].getWheelImages(Angles.angleType.RIGHT));
        $scope.frameImageSets.push($scope.wheelchairs[i].getFrameImages(Angles.angleType.FRONTRIGHT));
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
    getFrameParts();
    getWheelParts();

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

    $scope.totalPrice = function(){

    }
  }]);
