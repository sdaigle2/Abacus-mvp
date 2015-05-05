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
      //alert("FrameData test: " + JSON.stringify(FrameData.getFrame(frameID))); //Test alert please ignore
      User.createNewWheelchair(frameID);
      $location.path('abacus');
    };

    $scope.panelSelected = function (hoverItem, frameID) {
      return (hoverItem === frameID);
    }

  }]);









/*var dummyFramesData = [
  {
    frameID: 1,
    manufacturer: "Ti Arrow",
    name: "CKF",
    desc: "Ti Arrow's Standard Rigid Frame Wheelchair made from Titanium",
    basePrice: 2995,
    baseWeight: 45,
    imageURL: "images/frame_page_img/frame1_frame_page.png"
  },
  {
    frameID: 2,
    manufacturer: "Intelliwheels",
    name: "Intelliwheelchair",
    desc: "Better than anything our \"competition\" makes",
    basePrice: 1999,
    baseWeight: 30,
    imageURL: "images/frame_page_img/frame2_frame_page.png"
  }
];*/
