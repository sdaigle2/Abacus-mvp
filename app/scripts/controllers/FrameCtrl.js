'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:FrameCtrl
 * @description
 * # FrameCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('FrameCtrl', ['$scope', '$location', 'FrameData','User', function ($scope, $location, FrameData, User) {

    $scope.frames = FrameData.getFrames();

    $scope.selectFrame = function (frameID) {
      User.createNewWheelchair(frameID);
      $location.path('abacus');
    };

    $scope.panelSelected = function (hoverItem, frameID) {
      return (hoverItem === frameID);
    };

  }]);