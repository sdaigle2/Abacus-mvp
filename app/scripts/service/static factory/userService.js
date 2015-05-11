/// <reference path="userService.js" />=
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
  .service('User', ['$http', '$location', '$q', 'Order', 'Wheelchair', 'Units', 'Costs',
    function ($http, $location, $q, Order, Wheelchair, Units, Costs) {

    var orders = [];
    var designedWheelchairs = [];

    var curEditWheelchairIndex = -1;
    var userID = -1; //-1 means not logged in
    var fName = '';
    var lName = '';
    var email = '';
    var phone = '';

    var addr = '';
    var addr2 = '';
    var city = '';
    var state = '';
    var zip = '';
    var unitSys = Units.unitSys.IMPERIAL;

    //*********functions************//

    return {


      /************************LOGIN AND LOGOUT****************************/

      //Attempt to login as the given username with the given password
      //If successful - should load in appropriate user data
      login: function (in_email, password) {
        //TODO: Verify email and password
        //Call deferred.reject(message) if invalid

        var deferred = $q.defer();

        $.getJSON('data/user2Data.json')
          .done(function (data) {
            userID = data.ID;
            fName = data.fName;
            lName = data.lName;
            email = data.email;
            phone = data.phone;

            addr = data.addr;
            addr2 = data.addr2;
            city = data.city;
            state = data.state;
            zip = data.zip;
            deferred.resolve();
          })
          .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ', ' + error;
            console.log('Request Failed: ' + err);
            deferred.reject('Error loading user data');
          });

        //load Orders from DB associated with UserID
        //load Measurements from DB with associated UserID
        //load Designed Wheelchairs from DB associated with UserID

        return deferred.promise;
      },

      logout: function () {
        userID = -1; //-1 means not logged in
        fName = '';
        lName = '';
        email = '';
        phone = '';
        addr = '';
        addr2 = '';
        city = '';
        state = '';
        zip = '';
        unitSys = Units.unitSys.IMPERIAL;
        orders = [];
        //measures = []; //TODO: Reset to default
        designedWheelchairs = [];
        curEditWheelchairIndex = -1;
        $location.path('frames');
      },

      isLoggedIn: function () {
        return (userID !== -1);
      },

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
        var deferred = $q.defer();

        var editOrder = this.getCurEditOrder();
        editOrder.send(userID, userData, shippingData, payMethod)
          .then(function () {
            deferred.resolve();
          }, function () {
            deferred.reject();
          });

        return deferred.promise;
      },

      //***********get/sets
      getFname: function (){ return fName; },
      getLname: function () { return lName; },
      getEmail: function () { return email; },
      getPhone: function () { return phone; },
      getAddr: function () { return addr; },
      getAddr2: function () { return addr2; },
      getCity: function () { return city; },
      getState: function () { return state; },
      getZip: function () { return zip; },
      getUnitSys: function () { return unitSys; },

      getFullName: function () { return fName + ' ' + lName; },
      getFullAddr: function () { 
        var a2 = addr2;
        if (addr2 !== '')
          a2 = ' ' + a2;
        return addr + a2;
      },

      setFname: function (newFName) { fName = newFName; },
      setLname: function (newLName) { lName = newLName; },
      setEmail: function (newEmail) { email = newEmail; },
      setPhone: function (newPhone) { phone = newPhone; },
      setAddr: function (newAddr) { addr = newAddr; },
      setAddr2: function (newAddr2) { addr2 = newAddr2; },
      setCity: function (newCity) { city = newCity; },
      setState: function (newState) { state = newState; },
      setZip: function (newZip) { zip = newZip; },
      setUnitSys: function (newUnitSys) { unitSys = newUnitSys; }
    };

  }]);



