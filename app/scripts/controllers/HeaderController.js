// jshint unused:false

// This controller checks for a change in the active controller for the
// app and updates the navbar to highlight the current page
'use strict';

angular.module('abacuApp')
  .controller('HeaderController', ['$scope', '$location', 'User', function($scope, $location, User){

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    //Model used for login form
    $scope.loginModel = {
      email: '',
      password: ''
    };

    //Values set by logged-in user
    $scope.user = {
      loggedIn: false,
      email: '',
      name: ''
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
      User.login($scope.loginModel.email, $scope.loginModel.password)
        .then(function () {
          $scope.user.loggedIn = User.isLoggedIn();
          $scope.user.email = User.getEmail();
          $scope.user.name = User.getFullName();
          alert('You have successfully logged in as ' + $scope.user.name);
        }, function () {
          alert('Login failed');
        });

      $scope.loginModel.password = '';
    };
}]);
