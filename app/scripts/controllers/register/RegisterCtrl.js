/**
 * Created by Dhruv on 6/22/2015.
 */
angular.module('abacuApp')
  .controller('RegisterCtrl', ['$scope', '$http', '$location', 'User', 'Units',
    function ($scope, $http, $location, User, Units) {
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

      $scope.register = function(){
        $scope.error = '';
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
            $location.path('welcome');
          }
        })
          .error(function (data) {
            console.log('Request Failed: ' + data);
            deferred.reject('Error loading user data');
          });

      };
    }]);
