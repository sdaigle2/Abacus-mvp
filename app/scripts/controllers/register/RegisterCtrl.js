/**
 * Created by Dhruv on 6/22/2015.
 */
angular.module('abacuApp')
  .controller('RegisterCtrl', ['$scope', '$http', '$location', 'User', 'Units',
    function ($scope, $http, $location, User, Units) {
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
        $http({
          url: '/register'
          , data: $scope.accountModel
          , method: 'POST'
        }).success(function (data) {
          console.log(data);
          User.login($scope.accountModel.email, $scope.accountModel.password);
          $location.path('welcome');
        })
          .error(function (data) {
            console.log('Request Failed: ' + data);
            deferred.reject('Error loading user data');
          });

      };
    }]);
