'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:LockedDesignModal
 * @description
 * # grantModal
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('GrantModalCtrl', ['$scope','User',
    function ($scope, User) {
      $scope.grantAmount = 0;

      $scope.enterGrant = function(keyEvent){
        if (keyEvent.which === 13){
          $scope.closeThisDialog($scope.grantAmount);
        }
      };
    }]);
