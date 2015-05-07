// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static factory:orderFactory
 * @description
 * # orderFactory
 * Service of the abacuApp
 */
angular.module('abacuApp')
  .factory('Order', ['$http',function ($http, wheelchair){

    var payMethod = "advance";
    var subtotal = 0;
    var tax = 0.097
    var shipping = null;
    var total = 0;
    var orderWheelchairs = [];

    function getTotal (){
      if(orderWheelchairs.length > 0){
        var total = 0;
        for(var i = 0; i < orderWheelchairs.length; i++){
          total += orderWheelchairs[i].getTotalPrice();
        }
        return total;
      }
      return 0;
    }

    return{
      all: function(){
        return $http({method:"GET", url:"data/orderData.json"});
      },
      post: function(info){
        return $http({method:"POST", url:"data/orderData.json", data:info});
      },
      createOrder: function(payment, shippingFee, taxRate) {
        payMethod = payment;
        shipping = shippingMethod;
        subtotal = getTotal();
        tax = taxRate * subtotal;
        total = shipping + subtotal + tax;
        return true;
      },
      checkoutWheelchairs: function (curWheelchair){
        orderWheelchairs.push(curWheelchair);
      },
      deleteWheelchair: function(index){
        orderWheelchairs.splice(index,1);
      },


      //**************gets/sets************/
      getPayMethod: function () {return payMethod},
      getSubtotal: function () {return subtotal},
      getTax: function () {return tax},
      getShipping: function() {return shipping},
      getTotal: function () {return total},
      getOrderWheelchairs:function(){return orderWheelchair},

      getWheelchair: function(index){
        if(index >= 0 && index < orderWheelchairs.length)
          return orderWheelchairs[index];
        return null;
      }
    };
  }]);
