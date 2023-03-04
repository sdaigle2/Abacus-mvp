/**
 * Created by zhoufeng on 6/24/15.
 */

angular.module('abacuApp')
  .controller('WelcomeCtrl', ['$scope', '$http', '$location', 'User', 'Units', 'Drop',
    function ($scope, $http, $location, User, Units, Drop) {

      Drop.setFalse();
    function checkLogin(){
      if(!User.isLoggedIn()){
        $location.path('/register');
      }
    }
    $scope.getName = function(){
      // console.log(User)
      console.log(User.getFname() + User.getLname());
      return (User.getFullName());
    };

    $scope.goSettings = function(){
      $location.path('/settings');
    };

    $scope.goFrame = function(){
      $location.path('');
    };
    $scope.goDesign = function(){
      $location.path('/cart');
    };


    }]);

