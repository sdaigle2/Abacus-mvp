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
  .controller('InvoiceCtrl', ['$scope', '$location', 'User', 'FrameData', function ($scope, $location, User, FrameData) {
    var order = User.getLastOrder();
    $scope.name = User.getFullName();
    $scope.wheelchairs = order.getWheelchairs();
    $scope.orderNum = order.getOrderNum();

    function getFrame(wheelchair){
      var frameID = wheelchair.getFrameID();
      return FrameData.getFrame(frameID);
    }

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

    $scope.getPreviewImages = function(wheelchair, angle){
      return wheelchair.getPreviewImages(angle);
    };
  }]);
