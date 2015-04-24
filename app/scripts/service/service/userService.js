// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.service:userService
 * @description
 * # userService
 * Service of the abacuApp
 */
angular.module('abacuApp')
  .service('userService', ['$http', function ($http){

      this.all = function(){
        return $http({method:"GET", url:"data/userData.json"});
      };
      this.create = function(info){
        return $http({method:"POST", url:"data/userData.json", data:info});
      };
  }]);



