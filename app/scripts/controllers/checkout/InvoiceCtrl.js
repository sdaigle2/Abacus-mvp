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
  .controller('InvoiceCtrl', ['$scope', '$location', 'User', function ($scope, $location, User) {
    var order = User.getCurEditOrder();
    $scope.name = User.getFullName();
    $scope.wheelchairs = order.getWheelchairs();
    $scope.orderNum = order.getOrderNum();



  }]);
