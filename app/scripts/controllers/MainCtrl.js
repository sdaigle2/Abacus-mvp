'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('MainCtrl', function ($scope, $location) {

    $scope.frames = dummyFramesData; //TODO: You know the drill here - replace with actual data later

    $scope.selectFrame = function (frameID) {
      //TODO: Send user to abacus with chosen frame
      $location.path('abacus');
    };

  });




var dummyFramesData = [
  {
    frameID: 1,
    manufacturer: "Ti Arrow",
    name: "CKF",
    desc: "Ti Arrow's Standard Rigid Frame Wheelchair made from Titanium",
    basePrice: 2995,
    baseWeight: 45,
    imageURL: "images/mainpic.png"
  },
  {
    frameID: 2,
    manufacturer: "Intelliwheels",
    name: "Intelliwheelchair",
    desc: "Better than anything our \"competition\" makes",
    basePrice: 1999,
    baseWeight: 30,
    imageURL: "images/mainpic.png"
  }
];
