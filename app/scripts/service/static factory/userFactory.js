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
  .factory('userFactory', ['$http', 'orderFactory', function ($http, orderFactory ){
    var contactForm = {
      fName: "",
      lName: "",
      email: "",
      phone: ""
    };

    var shippingForm = {
      addr: "",
      addr2: "",
      city: "",
      state: "",
      zip: ""
    };

    var orders = [];
    var measures = [];

    //*********functions************//

    function loadorders(){
      orderFactory.all()
        .success(function(data){
          //order info
          orders = data;
          //console.log(JSON.stringify(orders ));
        })
        .error(function(data) {
          console.log("Request failed: " + data);
        });
    }





    return {
      all:function () {
        return $http({method: "GET", url: "data/userData.json"});
      },
      post:function(info) {
        return $http({method: "POST", url: "data/userData.json", data: info});
      },
      insertMeasure: function(measureID, option){
        measures.push({measureID:measureID, measureOption:option});
        return true;
      },
      insertOrder: function(id){
        order.push(id);
        return true;
      }
    };
  }]);



