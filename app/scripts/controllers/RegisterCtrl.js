/**
 * Created by Dhruv on 6/22/2015.
 */
angular.module('abacuApp')
  .controller('RegisterCtrl', ['$scope', '$location', 'User', 'Units',
    function ($scope, $location, User, Units) {
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
        confirm: ''
      };

      $scope.register = function(){
        $http({
          url: '/register'
          , data: accountModel
          , method: 'POST'
        }).success(function (data) {
          console.log(data);

        })
          .error(function (data) {
            console.log('Request Failed: ' + data);
            deferred.reject('Error loading user data');
          });
        return d
      };
    }]);
