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
    $scope.name = order.getFullName();
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
    $scope.location = $location;

    function getFrame(wheelchair) {
      var frameID = wheelchair.getFrameID();
      return FrameData.getFrame(frameID);
    }

    function getImageSets() {
      for (var i = 0; i < $scope.wheelchairs.length; i++) {
        $scope.topImageSets.push($scope.wheelchairs[i].getPreviewImages(Angles.angleType.BACKRIGHT));
        $scope.midImageSets.push($scope.wheelchairs[i].getPreviewImages(Angles.angleType.FRONTRIGHT));
        $scope.botImageSets.push($scope.wheelchairs[i].getPreviewImages(Angles.angleType.RIGHT));
        $scope.wheelImageSets.push($scope.wheelchairs[i].getWheelImages(Angles.angleType.RIGHT));
        $scope.frameImageSets.push($scope.wheelchairs[i].getFrameImages(Angles.angleType.FRONTRIGHT));
      }
      $scope.invoice_canvas_images = new Array(
        $scope.topImageSets,
        $scope.midImageSets,
        $scope.botImageSets,
        $scope.frameImageSets,
        $scope.wheelImageSets
      );
    }

    function getMeasurements() {
      for (var i = 0; i < $scope.wheelchairs.length; i++) {
        var measures = $scope.wheelchairs[i].getMeasures();
        var newMeasures = [];
        for (var j = 0; j < measures.length; j++) {
          var newMeasure = $scope.wheelchairs[i].getMeasureDetails(measures[j].measureID, Units.unitSys.IMPERIAL);
          newMeasures.push(newMeasure);
        }
        $scope.measurements.push(newMeasures);
      }
    }


    function getFrameParts() {
      for (var i = 0; i < $scope.wheelchairs.length; i++) {
        var frame = getFrame($scope.wheelchairs[i]);
        var customizeDetails = [];
        for (var j = 0; j < frame.getWheelIndex(); j++) {
          var partDetails = $scope.wheelchairs[i].getPartDetails(frame.getPartByIndex(j).getID(), 0);
          customizeDetails.push(partDetails);
        }
        $scope.frameParts.push(customizeDetails);
      }
    }

    function getWheelParts() {
      for (var i = 0; i < $scope.wheelchairs.length; i++) {
        var frame = getFrame($scope.wheelchairs[i]);
        var customizeDetails = [];
        for (var j = frame.getWheelIndex(); j < frame.getNumParts(); j++) {
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

    $scope.getManufacturer = function (wheelchair) {
      var frame = getFrame(wheelchair);
      return frame.getManufacturer();
    };

    $scope.getBasePrice = function (wheelchair) {
      var frame = getFrame(wheelchair);
      return '$' + frame.getBasePrice();
    };

    $scope.getModel = function (wheelchair) {
      var frame = getFrame(wheelchair);
      return frame.getName();
    };

    $scope.getBaseWeight = function (wheelchair) {
      var frame = getFrame(wheelchair);
      return frame.getBaseWeight() + 'lb';
    };
  }])
  .directive('myCanvas', function($compile){
    return function (scope, element, attrs) {
      console.log(attrs.val);
      console.log(attrs.index);
      console.log(element);
      var canvas_images = scope.invoice_canvas_images[attrs.val][attrs.index];
      var stack = new Array();
      for (var i = 0; i < canvas_images.length; i++) {
        stack.push(canvas_images[i].URL);
      }
      if (attrs.val < 3)
        stackImages(element[0], stack, 264, 201);
      else
        stackImages(element[0], stack, 187, 143);
    }
  });
