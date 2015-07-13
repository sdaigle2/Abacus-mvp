// jshint unused:false

// This controller checks for a change in the active controller for the
// app and updates the navbar to highlight the current page
'use strict';

angular.module('abacuApp')
  .controller('HeaderController', ['$scope', '$location', '$http', '$timeout', 'User', 'Drop', function ($scope, $location, $http, $timeout, User, Drop) {

    //Returns true is the current angular URL matches viewLocation
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.loginText = 'Log In';

    $scope.error = '';
    //Model used for login form
    $scope.loginModel = {
      email: '',
      password: ''
    };

    //Values set by logged-in user
    $scope.user = User;

    //cartIcon image controll
    $scope.cartIconShown = function () {
      if (User.getNumDesignedWheelchairs() === 1) {
        return 1;
      }
      if (User.getNumDesignedWheelchairs() === 2) {
        return 2;
      }
      if (User.getNumDesignedWheelchairs() === 3) {
        return 3;
      }

    };

    //Sends the user to a password recovery system
    $scope.recoverPassword = function () {
      //TODO: Password recovery system
      window.alert('Password Recovery coming soon');
    };

    //Sends the user to a registration page
    $scope.register = function () {
      $location.path('/register');
    };

    //Log in the user using the data from loginModel
    $scope.login = function () {
      $scope.loginText = 'Loading..';
      $scope.error = '';
      User.login($scope.loginModel.email, $scope.loginModel.password)
        .then(function () {
          $timeout(function () {
            $scope.$apply($scope.loginText = 'Log In');
            $scope.$apply($scope.loginDropdown = false);
          });
        }, function (message) {
          $timeout(function () {
            $scope.$apply($scope.loginText = 'Log In');
            $scope.$apply($scope.error = message);
          });
        });
      $scope.loginModel.password = '';
    };

    $scope.logout = function () {
      User.logout();
    };

    $scope.loginSection = function (section) {
      User.setContentSection(section);
      Drop.setFalse();
      $location.path('/settings');
    };

    $scope.loginDropdown = function(){
      return Drop.loginDropdown();
    };

    $scope.settingsDropdown = function(){
      return Drop.settingsDropdown();
    };

    $scope.toggleLoginDropdown = function () {
      if($scope.loginText === 'Log In')
        Drop.toggleLogin();
    };

    $scope.toggleSettingsDropdown = function () {
        Drop.toggleSettings();
    };

  }]);
