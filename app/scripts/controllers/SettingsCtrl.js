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

    $scope.MeasurementHelpSection = {
      NONE : '',
      REAR_SEAT_HEIGHT : 'rearSeatHeight',
      REAR_SEAT_WIDTH : 'rearSeatWidth',
      FOLDING_BACKREST_HEIGHT : 'foldingBackrestHeight',
      AXEL_POSITION : 'axelPosition',
      SEAT_DEPTH : 'seatDepth'
    };



    $scope.contentSection = $scope.ContentSection.ACCOUNT;
    $scope.measurementHelpSection = $scope.MeasurementHelpSection.REAR_SEAT_HEIGHT;



    $scope.getContentSection = function () {
      return $scope.contentSection;
    };

    $scope.setContentSection = function (contentSection) {
      $scope.resetMeasurementHelpSection();
      $scope.contentSection = contentSection;
    };

    $scope.resetContentSection = function() {
      $scope.contentSection = $scope.ContentSection.ACCOUNT;
    }



    $scope.getMeasurementHelpSection = function () {
      return $scope.measurementHelpSection;
    };

    $scope.setMeasurementHelpSection = function (measurementHelpSection) {
      $scope.measurementHelpSection = measurementHelpSection;
    };

    $scope.resetMeasurementHelpSection = function () {
      $scope.measurementHelpSection = $scope.MeasurementHelpSection.REAR_SEAT_HEIGHT;
    }



  });
