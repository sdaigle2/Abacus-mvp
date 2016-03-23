/**
 * Created by Dhruv on 6/22/2015.
 */
angular.module('abacuApp')
  .controller('RegisterCtrl', ['$scope', '$http', '$location', 'User', 'Units', 'Drop', '$q',
    function ($scope, $http, $location, User, Units, Drop,$q) {
      if(User.isLoggedIn()){
        $location.path('/');
      }
      Drop.setFalse();
      $scope.error = '';
      $scope.accountModel = {
        fName: '',
        lName: '',
        email: '',
        phone: '',
        addr: '',
        addr2: '',
        city: '',
        state: '',
        zip: '',
        password: '',
        confirm: '',
        orders: []
      };

      var checkField = function(){
        for(key in $scope.accountModel){
          if(_.isEmpty($scope.accountModel.key)){
            return true
          }
            return false
        }
      };

      $scope.register = function(){
        var deferred = $q;
        $scope.error = '';
        if(checkField()){
          deferred.reject('Missing field');
          $scope.error = 'Missing field';
          return deferred.promise
        }
        $http({
          url: '/register'
          , data: $scope.accountModel
          , method: 'POST'
        }).success(function (data) {
          console.log(data);
          if(data.err) {
            $scope.error = data.err;
            if(data.field === 'password'){
              $scope.accountModel.password = '';
              $scope.accountModel.confirm = '';
            }
            else
            if(data.field === 'email'){
              $scope.accountModel.email = '';
            }
          }
          else {
            User.login($scope.accountModel.email, $scope.accountModel.password);
            $location.path('/welcome');
          }
        })
          .error(function (data) {
            console.log('Request Failed: ' + data);
            deferred.reject('Error loading user data');
          });
      };

      $scope.registerAction = function(){
        var deferred = $q;
        $scope.error = '';
        if(checkField()){
          deferred.reject('Missing field');
          $scope.error = 'Missing field';
          return deferred.promise
        }
        $http({
          url: '/register'
          , data: $scope.accountModel
          , method: 'POST'
        }).success(function (data) {
          console.log(data);
          if(data.err) {
            $scope.error = data.err;
            if(data.field === 'password'){
              $scope.accountModel.password = '';
              $scope.accountModel.confirm = '';
            }
            else
            if(data.field === 'email'){
              $scope.accountModel.email = '';
            }
          }
          else {
            User.login($scope.accountModel.email, $scope.accountModel.password);
            $scope.saveForLater();
            $scope.$parent.loginPanel = 'saved';
          }
        })
          .error(function (data) {
            console.log('Request Failed: ' + data);
            deferred.reject('Error loading user data');
          });
      };
    }]);
