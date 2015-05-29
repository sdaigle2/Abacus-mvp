// jshint unused:false

// This controller checks for a change in the active controller for the
// app and updates the navbar to highlight the current page
'use strict';

angular.module('abacuApp')
  .controller('HeaderController', ['$scope', '$location', 'User', function($scope, $location, User){

    //Returns true is the current angular URL matches viewLocation
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    //Model used for login form
    $scope.loginModel = {
      email: '',
      password: ''
    };

    //Values set by logged-in user
    $scope.user = User;

    //Sends the user to a password recovery system
    $scope.recoverPassword = function () {
      //TODO: Password recovery system
      window.alert('Password Recovery coming soon');
    };

    //Sends the user to a registration page
    $scope.register = function () {
      //TODO: Registration system
      window.alert('Registration coming soon');
    };

    //Log in the user using the data from loginModel
    $scope.login = function () {
      User.login($scope.loginModel.email, $scope.loginModel.password)
        .then(function () {
          //TODO: Something?
        }, function (message) {
          window.alert('Login failed: ' + message);
        });

      $scope.loginModel.password = '';
    };

}]);
