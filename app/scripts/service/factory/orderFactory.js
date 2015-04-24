// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.service:orderFactory
 * @description
 * # orderFactory
 * Service of the abacuApp
 */
angular.module('abacuApp')
  .factory('orderFactory', ['$http', 'userService', function ($http,userService){
    userService.all()
    .success(function(data){
      var user = data;
      console.log(JSON.stringify(data ));
    })
    .error(function(data) {
      console.log("Request failed: " + data);
    });


    return{
      all: function(){
        return $http({method:"GET", url:"data/orderData.json"});
      },
      create: function(info){
        return $http({method:"POST", url:"data/orderData.json", data:info});
      }
    };
  }]);
