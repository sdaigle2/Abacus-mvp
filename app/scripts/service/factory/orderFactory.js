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
  .factory('Order', [function (){

    function Order(taxRate, shippingFee) {
      this.wheelchairs = [];
      this.payMethod = 'advance';
      this.orderNum = 'OrderNumNotSet';
      this.taxRate = taxRate;
      this.shippingFee = shippingFee;
      this.sent = false;
    };

    Order.prototype = {

      addWheelchair: function (newWheelchair) {
        this.wheelchairs.push(newWheelchair);
      },

      removeWheelchair: function (index) {
        if (index >= 0 && index < this.wheelchairs.length)
          return this.wheelchairs.splice(index, 1);
        return null;
      },

      //**************gets/sets************/
      getPayMethod: function () { return this.payMethod; },
      getTaxRate: function () { return this.taxRate; },
      getShippingFee: function () { return this.shippingFee; },
      getOrderNum: function () { return this.orderNum; },
      getWheelchairs: function () { return this.wheelchairs; },
      getNumWheelchairs: function () { return this.wheelchairs.length; },
      hasBeenSent: function () { return this.sent; },


      setPayMethod: function (newMethod) { this.payMethod = newMethod; },
      setOrderNum: function (numNum) { this.orderNum = newNum; },

      getWheelchair: function (index) {
        if (index >= 0 && index < this.wheelchairs.length)
          return this.wheelchairs[index];
        return null;
      },

      /*****************Cost Calculators****************/
      getSubtotal: function () {
        if (orderWheelchairs.length > 0) {
          var total = 0;
          for (var i = 0; i < orderWheelchairs.length; i++) {
            total += orderWheelchairs[i].getTotalPrice();
          }
          return total;
        }
        return 0;
      },

      getShippingCost: function () {
        return this.getShippingFee() * this.getNumWheelchairs();
      },

      getTaxCost: function () {
        return this.getSubtotal() * this.getTaxRate();
      },

      getTotalCost: function () {
        return this.getSubtotal() + this.getShippingCost() + this.getTaxCost();
      },

      /********************Saving to DB***********************/

      send: function (userData) {
        //TODO: save userData to order
        //TODO: Save current date to order
        this.sent = true;

        //TODO: Send order into database

      },

    };

    //Create an order object using data from JSON
    Order.fromJSONData = function (jsonData) {
      var newOrder = new Order(jsonData.taxRate, jsonData.shippingFee);
      newOrder.setOrderNum(jsonData.orderNum);
      newOrder.setPayMethod(jsonData.payMethod);
      for (var i = 0; i < jsonData.wheelchairs.length; i++) {
        newOrder.addWheelchair(jsonData.wheelchairs[i]);
      }
      newOrder.sent = true;
      return newOrder;
    };

    return (Order);
  }]);
