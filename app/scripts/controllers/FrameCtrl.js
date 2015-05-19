'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:FrameCtrl
 * @description
 * # FrameCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('FrameCtrl', ['$scope', '$location', 'FrameData', 'User', 'Units',
    function ($scope, $location, FrameData, User, Units) {

    $scope.frames = FrameData.getFrames();

    $scope.selectFrame = function (frameID) {
      //Create a new wheelchair and set is as curEditWheelchair
      User.createNewWheelchair(frameID);

      //Send the user to Abacus
      $location.path('abacus');
    };

    $scope.panelSelected = function (hoverItem, frameID) {
      return (hoverItem === frameID);
    };

    $scope.getWeightString = function (frame) {
      return (frame.getBaseWeight() * Units.getWeightFactor(User.getUnitSys())) + ' ' + Units.getWeightName(User.getUnitSys());
    };

  }]);