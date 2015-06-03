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
  .controller('SaveCtrl', ['$scope', '$location', 'User', 'FrameData', 'Units', 'Angles', function ($scope, $location, User, FrameData, Units, Angles) {
    $scope.wheelchair = User.getCurEditWheelchair();

    var fID = $scope.wheelchair.getFrameID();
    var frame = FrameData.getFrame(fID);

    $scope.manufacturer = frame.getManufacturer();
    $scope.model = frame.getName();

    $scope.topImageSet = $scope.wheelchair.getPreviewImages(Angles.angleType.BACKRIGHT);
    $scope.midImageSet = $scope.wheelchair.getPreviewImages(Angles.angleType.FRONTRIGHT);
    $scope.botImageSet = $scope.wheelchair.getPreviewImages(Angles.angleType.RIGHT);

    $scope.wheelImageSet = $scope.wheelchair.getWheelImages(Angles.angleType.RIGHT);
    $scope.frameImageSet = $scope.wheelchair.getFrameImages(Angles.angleType.FRONTRIGHT);

    $scope.frameParts = [];
    $scope.wheelParts = [];
    $scope.measures = [];

    function getMeasurements() {
      var measures = $scope.wheelchair.getMeasures();
      var newMeasures = [];
      for (var j = 0; j < measures.length; j++) {
        var newMeasure = $scope.wheelchair.getMeasureDetails(measures[j].measureID, Units.unitSys.IMPERIAL);
        newMeasures.push(newMeasure);
      }
      $scope.measures = newMeasures;
    }

    function getFrameParts() {
      var customizeDetails = [];
      for (var j = 0; j < frame.getWheelIndex(); j++) {
        var partDetails = $scope.wheelchair.getPartDetails(frame.getPartByIndex(j).getID(), 0);
        customizeDetails.push(partDetails);
      }
      $scope.frameParts = customizeDetails;
    }

    function getWheelParts() {
      var customizeDetails = [];
      for (var j = frame.getWheelIndex(); j < frame.getNumParts(); j++) {
        var partDetails = $scope.wheelchair.getPartDetails(frame.getPartByIndex(j).getID(), 0);
        customizeDetails.push(partDetails);
      }
      $scope.wheelParts = customizeDetails;
    }

    getFrameParts();
    getWheelParts();
    getMeasurements();
  }]);
