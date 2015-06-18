// jshint unused:false

// This controller checks for a change in the active controller for the
// app and updates the navbar to highlight the current page
'use strict';

angular.module('abacuApp')
  .controller('HeaderController', ['$scope', '$location', '$http', 'User', function ($scope, $location, $http, User) {

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
      $http({
        url: '/register',
        data: {
          email: $scope.loginModel.email,
          password: $scope.loginModel.password,
          fName: 'Bricottahsaven',
          lName: 'Bob',
          phone: 12345678902,
          addr: '123 Street St',
          addr2: '',
          city: 'Oz',
          state: 'IL',
          zip: 61855,
          unitSys: 1,
          orders: [],
          wheelchairs: []
        },
        method: 'POST'
      }).success(function (data) {
        console.log(data);
      })
        .error(function (data) {
          console.log('Request Failed: ' + data);
        });
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

    $scope.logout = function () {
      User.logout();
    };

    $scope.loginSection = function(section){
      User.setContentSection(section);
      $location.path('/settings');
    }

}]);
