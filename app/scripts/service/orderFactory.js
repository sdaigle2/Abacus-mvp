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
  .factory('orderFactory', ['$http', function ($http){
    return{
      all: function(){
        return $http({method:"GET", url:"data/orderData"});
      },
      create: function(info){
        return $http({method:"POST", url:"data/orderData", data:info});
      }
    };
  }]);
