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
  .factory('Order', ['$q', function ($q){

    function Order(taxRate, shippingFee) {
      this.wheelchairs = [];
      this.orderNum = 'OrderNumNotSet';
      this.taxRate = taxRate;
      this.shippingFee = shippingFee;
      this.sentDate = null;

      this.userID = -1;
      this.fName = '';
      this.lName = '';
      this.email = '';
      this.phone = '';
      this.addr = '';
      this.addr2 = '';
      this.city = '';
      this.state = '';
      this.zip = '';

      this.payMethod = '';
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
      getSentDate: function () { return this.sentDate; },
      getUserID: function () { return this.userID; },
      getFname: function () { return this.fName; },
      getLname: function () { return this.lName; },
      getEmail: function () { return this.email; },
      getPhone: function () { return this.phone; },
      getAddr: function () { return this.addr; },
      getAddr2: function () { return this.addr2; },
      getCity: function () { return this.city; },
      getState: function () { return this.state; },
      getZip: function () { return this.zip; },

      getFullName: function () { return this.fName + ' ' + this.lName; },
      getFullAddr: function () {
        var a2 = this.addr2;
        if (this.addr2 !== '')
          a2 = ' ' + a2;
        return this.addr + a2;
      },

      hasBeenSent: function () { return this.sentDate !== null; },

      getWheelchair: function (index) {
        if (index >= 0 && index < this.wheelchairs.length)
          return this.wheelchairs[index];
        return null;
      },

      /*****************Cost Calculators****************/
      getSubtotal: function () {
        if (this.wheelchairs.length > 0) {
          var total = 0;
          for (var i = 0; i < this.wheelchairs.length; i++) {
            total += this.wheelchairs[i].getTotalPrice();
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

      send: function (userID, userData, shippingData, payMethod) {
        var deferred = $q.defer();

        var curThis = this;

        //Save userData, shippingData, and payMethod into Order
        this.userID = userID;
        this.fName = userData.fName;
        this.lName = userData.lName;
        this.email = userData.email;
        this.phone = userData.phone;
        this.addr = shippingData.addr;
        this.addr2 = shippingData.addr2;
        this.city = shippingData.city;
        this.state = shippingData.state;
        this.zip = shippingData.zip;
        this.payMethod = payMethod;
        this.sentDate = new Date(); //Now

        //Fake asyncronous call - TODO: Replace with actual asyncronous call
        //TODO: Send order into database
        setTimeout(function () {

          curThis.orderNum = '1234'; //TODO: Set generated orderNum
          deferred.resolve();

        }, 3000);      

        return deferred.promise;
      }

    };

    //Create an order object using data from JSON
    Order.fromJSONData = function (jsonData) {
      var newOrder = new Order(jsonData.taxRate, jsonData.shippingFee);
      newOrder.orderNum = jsonData.orderNum;
      newOrder.payMethod = jsonData.payMethod;
      newOrder.userID = jsonData.userID;
      newOrder.sentDate = jsonData.sentDate; //TODO: Need to convert?
      newOrder.fName = jsonData.fName;
      newOrder.lName = jsonData.lName;
      newOrder.phone = jsonData.phone;
      newOrder.email = jsonData.email;
      newOrder.addr = jsonData.addr;
      newOrder.addr2 = jsonData.addr2;
      newOrder.city = jsonData.city;
      newOrder.state = jsonData.state;
      newOrder.zip = jsonData.zip;
      for (var i = 0; i < jsonData.wheelchairs.length; i++) {
        newOrder.addWheelchair(jsonData.wheelchairs[i]);
      }
      newOrder.sentDate = jsonData.sentDate;
      return newOrder;
    };

    return (Order);
  }]);
