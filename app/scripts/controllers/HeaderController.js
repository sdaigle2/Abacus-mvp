// jshint unused:false

// This controller checks for a change in the active controller for the
// app and updates the navbar to highlight the current page
'use strict';

angular.module('abacuApp')
  .controller('HeaderController', ['$scope', '$location', '$http', '$timeout', 'User', 'Drop', '$window', function ($scope, $location, $http, $timeout, User, Drop, $window) {

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
      if (User.getNumCartWheelchairs() === 1) {
        return 1;
      }
      if (User.getNumCartWheelchairs() === 2) {
        return 2;
      }
      if (User.getNumCartWheelchairs() === 3) {
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
          $scope.loginText = 'Log In';
          $scope.loginModel.email = '';
          $scope.toggleLoginDropdown();
        }, function (message) {
          $scope.loginText = 'Log In';
          $scope.error = message;
        });
      $scope.loginModel.password = '';
    };

    $scope.logout = function () {
      User.logout();
      if($location.path() === '/settings')
        $location.path('/frames');
      Drop.setFalse();
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
      if($scope.loginText === 'Log In') {
        Drop.toggleLogin();
      }
    };

    $scope.toggleSettingsDropdown = function () {
        Drop.toggleSettings();
    };

    $scope.closeDropdown = function () {
      Drop.setFalse();
    };

    $scope.accountURL = 'my_account_big';
    $scope.orderURL = 'my_orders';
    $scope.measureURL = 'my_measurement';

    $scope.jumpFrame = function(){
      $location.path('/frames');
    };
    $scope.jumpAbout = function(){
      $location.path('/about');
    };
    $scope.jumpCart = function(){
      $location.path('/cart');
    };

    $scope.$on('$viewContentLoaded', function(event) {
      $window.ga('send', 'pageview', { page: $location.url() });
    });


  }]);
