// jshint unused:false

// This controller checks for a change in the active controller for the
// app and updates the navbar to highlight the current page
'use strict';

angular.module('abacuApp')
  .controller('HeaderController', function($scope, $location){

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.loginModel = {
      email: '',
      password: ''
    };

    $scope.recoverPassword = function () {
      //TODO: Password recovery system
      window.alert('Password Recovery coming soon');
    };

    $scope.register = function () {
      //TODO: Registration system
      window.alert('Registration coming soon');
    };

    $scope.login = function () {
      //TODO: Login system
      window.alert(JSON.stringify($scope.loginModel));
    };
});
