// jshint unused:false

// This controller checks for a change in the active controller for the
// app and updates the navbar to highlight the current page
'use strict';

angular.module('abacuApp')
  .controller('HeaderController', ['$scope', '$location', '$http', '$timeout', 'User', 'Drop', '$window','$q', function ($scope, $location, $http, $timeout, User, Drop, $window, $q) {

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
      if (User.getNumCartWheelchairs() > 3) {
        return 4;
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
      $scope.error = '';
      var deferred = $q;

      if (!([$scope.loginModel.email, $scope.loginModel.password].every(_.isString)) || [$scope.loginModel.email, $scope.loginModel.password].some(_.isEmpty)) {
        $scope.error = 'Missing Username or Password';
        deferred.reject(new Error('Missing Username or Password'));
        return deferred.promise;
      }

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

    $scope.enterLogin = function(keyEvent){
      if (keyEvent.which === 13){
        $scope.login();
      }
    };

    $scope.logout = function () {
      User.logout();
      if($location.path() === '/settings')
        $location.path('/frames');
      Drop.setFalse();
    };

    $scope.loginSection = function (section) {
      Drop.setFalse();
      $location.path('/settings').search({'section': section});
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
      $scope.error = '';
    };

    $scope.accountURL = 'my_account_big';
    $scope.orderURL = 'my_orders';
    $scope.measureURL = 'my_measurement';

    $scope.jumpLanding = function(){
        $location.path('/');
    };
    $scope.jumpP4X = function(){
        $location.path('http://www.per4max.com');
    };
    $scope.jumpFrame = function(){
      $location.path('/frames');
    };
    $scope.jumpWheels = function(){
      $location.path('/frames');
    };
    $scope.jumpAbout = function(){
      $location.path('/about');
    };
    $scope.jumpCart = function(){
      $location.path('/cart');
    };

    $scope.jumpSearchid = function(){
      $location.path('/searchid');
    };

    $scope.$on('$viewContentLoaded', function(event) {
      $window.ga('send', 'pageview', { page: $location.url() });
    });


  }]);
