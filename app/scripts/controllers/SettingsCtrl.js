// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('SettingsCtrl', function ($scope, $location, sharedVars) {


    $scope.ContentSection = {
      ACCOUNT : 'account',
      ORDERS : 'orders',
      MEASUREMENTS : 'measurements'
    };


    $scope.contentSection = $scope.ContentSection.ACCOUNT;


    $scope.getContentSection = function () {
      return $scope.contentSection;
    };

    $scope.setContentSection = function (contentSection) {
      $scope.contentSection = contentSection;
    };



  });
