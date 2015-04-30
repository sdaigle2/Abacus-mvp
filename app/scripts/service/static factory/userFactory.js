// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static factory:userService
 * @description
 * # userService
 * Service of the abacuApp
 */
angular.module('abacuApp')
  .factory('userFactory', ['$http', function ($http){



    return {
      all:function () {
        return $http({method: "GET", url: "data/userData.json"});
      },
      create:function(info) {
        return $http({method: "POST", url: "data/userData.json", data: info});
      }
    };
  }]);



