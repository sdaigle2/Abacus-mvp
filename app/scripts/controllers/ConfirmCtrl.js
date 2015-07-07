/**
 * Created by Dhruv on 6/25/2015.
 */
'use strict';

angular.module('abacuApp')
  .controller('ConfirmCtrl', ['$scope', '$location', '$http', '$routeParams', 'User', 'Drop', function ($scope, $location, $http, $routeParams, User, Drop) {
    Drop.setFalse();
    var id = $routeParams.param1;
    console.log(id);
    $http({
      url: '/confirm'
      , data: {id: id}
      , method: 'POST'
    }).success(function (data) {
      console.log(data);
      alert('Account created');
      $location.path('/frames');
    })
      .error(function (data) {
        console.log('Request Failed: ' + data);
      });
  }]);
