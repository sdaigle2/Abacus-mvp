/// <reference path="userService.js" />
// jshint unused:false
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static factory:userService
 * @description
 * # userService
 * Service of the abacuApp
 */
angular.module('abacuApp')
  .service('User', ['$http', '$location', 'Order', 'Wheelchair', 'Units', 'Costs',
    function ($http, $location, Order, Wheelchair, Units, Costs) {

    var orders = [];
    var designedWheelchairs = [];

    var curEditWheelchairIndex = -1;

    //*********functions************//

    return {

      userID: -1, //-1 means not logged in

      fName: '',
      lName: '',
      email: '',
      phone: '',

      addr: '',
      addr2: '',
      city: '',
      state: '',
      zip: '',

      unitSys: Units.unitSys.IMPERIAL,

      /************************LOGIN AND LOGOUT****************************/

      //Attempt to login as the given username with the given password
      //If successful - should load in appropriate user data
      login: function (email, password) {
        //TODO: Actually write function

        //Verify email and password
        //Set userID
        //Set other user fields
        //load Orders from DB associated with UserID
        //load Measurements from DB with associated UserID
        //load Designed Wheelchairs from DB associated with UserID
      },

      logout: function () {
        this.userID = -1; //-1 means not logged in
        this.fName = '';
        this.lName = '';
        this.email = '';
        this.phone = '';
        this.addr = '';
        this.addr2 = '';
        this.city = '';
        this.state = '';
        this.zip = '';
        this.unitSys = Units.unitSys.IMPERIAL;
        orders = [];
        //measures = []; //TODO: Reset to default
        designedWheelchairs = [];
        curEditWheelchairIndex = -1;
        $location.path('frames');
      },

      isLoggedIn: function () { return (this.userID !== -1); },

      /*************************MY DESIGNS*******************************/

      //Create a new wheelchair object of given frame type and set edit pointer to it
      createNewWheelchair: function (frameID) {
        designedWheelchairs.push(new Wheelchair(frameID));
        curEditWheelchairIndex = designedWheelchairs.length - 1;
      },

      //Set the given wheelchair index to be edited
      setEditWheelchair: function (index) {
        if (index >= 0 && index < designedWheelchairs.length)
          curEditWheelchairIndex = index;
      },

      //Removes the wheelchair at the given index from the user's myDesign
      deleteWheelchair: function (index) {
        designedWheelchairs.splice(index, 1);
      },

      getDesignedWheelchairs: function () { return designedWheelchairs; },

      getWheelchair: function (index) {
        if (index >= 0 && index < designedWheelchairs.length)
          return designedWheelchairs[index];
        return null;
      },

      getCurEditWheelchair: function () {
        return this.getWheelchair(curEditWheelchairIndex);
      },

      /******************************MY MEASUREMENTS*******************************/

      commonMeasures : {
        REAR_SEAT_HEIGHT : -1,
        REAR_SEAT_WIDTH : -1,
        FOLDING_BACKREST_HEIGHT : -1,
        AXEL_POSITION : -1,
        SEAT_DEPTH : -1
      },


      /******************************MY ORDERS*******************************/

      getAllOrders: function () { return orders; },
      getNumOrders: function () { return orders.length; },

      getSentOrders: function () {
        var sentOrders = orders;
        if (sentOrders.length > 0) {
          var lastOrder = sentOrders[sentOrders.length - 1];
          if (!lastOrder.hasBeenSent())
            sentOrders.splice(sentOrders.length - 1, 1);
        }
        return sentOrders;
      },

      createNewOrder: function () {
        if (orders.length > 0) {
          var lastOrder = orders[orders.length - 1];
          if (!lastOrder.hasBeenSent())
            orders.splice(orders.length - 1, 1);
        }

        var newOrder = new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE);
        orders.push(newOrder);
      },

      getCurEditOrder: function () {
        if (orders.length > 0) {
          var lastOrder = orders[orders.length - 1];
          if (!lastOrder.hasBeenSent())
            return lastOrder;
        }
        return null;
      },

      sendCurEditOrder: function (userData, shippingData, payMethod) {
        var editOrder = this.getCurEditOrder();
        return editOrder.send(userData, shippingData, payMethod);
      }


    };

  }]);



