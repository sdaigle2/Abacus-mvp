'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:FrameCtrl
 * @description
 * # FrameCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('FrameCtrl', ['$scope', '$location', 'FrameData', 'user', function ($scope, $location, FrameData, user) {

    $scope.frames = [];

    function initialize() {
      for (var i = 0; i < FrameData.getNumFrames(); i++) {
        var f = FrameData.getFrameByIndex(i);
        $scope.frames.push({
          frameID: f.getID(),
          manufacturer: f.getManufacturer(),
          name: f.getName(),
          desc: f.getDesc(),
          basePrice: f.getBasePrice(),
          baseWeight: f.getBaseWeight(),
          imageURL: f.getImageURL()
        });
      }
    };

    $scope.selectFrame = function (frameID) {
      //TODO: Send user to abacus with chosen frame

      alert("FrameData test: " + JSON.stringify(FrameData.getFrame(frameID))); //Test alert please ignore

      user.createNewWheelchair(frameID);
      $location.path('abacus');
    };

    $scope.panelSelected = function (hoverItem, frameID) {
      return (hoverItem === frameID);
    }

    initialize();

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
