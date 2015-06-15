'use strict';

/**
 * @ngdoc function
 * @name abacuApp.serives:userService
 * @description
 * # userService
 * Service of the abacuApp
 */

/*
 *
 */
angular.module('abacuApp')
  .service('User', ['$http', '$location', '$q', 'Order', 'Wheelchair', 'Units', 'Costs',
    function ($http, $location, $q, Order, Wheelchair, Units, Costs) {

      var orders = [];
      var currentWheelchair = {isNew: false, editingWheelchair: null};
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

        allDetails: function (){
          return {
            'userID': userID,
            'fName': fName,
            'lName': lName,
            'email': email,
            'phone': phone,
            'addr': addr,
            'addr2': addr2,
            'city': city,
            'state': state,
            'zip': zip,
            'unitSys': unitSys,
            'orders': orders,
            'wheelchairs': designedWheelchairs
          }
        },

        /************************LOGIN AND LOGOUT****************************/

        //Attempt to login as the given username with the given password
        //If successful - should load in appropriate user data
        login: function (in_email, password) {
          //TODO: Verify email and password
          //Call deferred.reject(message) if invalid

          var deferred = $q.defer();
          $http({
            url: '/login'
            , data: {email: in_email, password: password}
            , method: 'POST'
          }).success(function (data) {
            console.log(data);
            fName = data.fName;
            lName = data.lName;
            userID = data.userID;
            deferred.resolve();
          })
            .error(function (data) {
              console.log('Request Failed: ' + data);
              deferred.reject('Error loading user data');
            });

          //TODO: load Orders from DB associated with UserID
          //TODO: load Common Measurements from DB with associated UserID
          //TODO: load Designed Wheelchairs from DB associated with UserID

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
          //TODO: Reset CommonMeasures
          designedWheelchairs = [];
          curEditWheelchairIndex = -1;

          $location.path('frames');
        },

        //Returns true if the user is logged in
        isLoggedIn: function () {
          return (userID !== -1);
        },

        /*************************MY DESIGNS*******************************/

        createCurrentDesign: function (frameID) {
          currentWheelchair.editingWheelchair = new Wheelchair(frameID);
          currentWheelchair.isNew = true;
        },

        //Create a new wheelchair object of given frame type and set edit pointer to it
        pushNewWheelchair: function () {
          if (currentWheelchair.isNew === true) {
            designedWheelchairs.push(currentWheelchair.editingWheelchair);
            curEditWheelchairIndex = designedWheelchairs.length - 1;
          }
          else if (currentWheelchair.isNew === false) {
            designedWheelchairs[curEditWheelchairIndex] = jQuery.extend(true, currentWheelchair.editingWheelchair);
          }

          if (userID !== -1) {
            $http({
              url: '/wheelchair',
              data: this.allDetails(),
              method: 'POST'
            }).success(function (data) {
              console.log(data);
            })
              .error(function (data) {
                console.log('Request Failed: ' + data);
              });
          }
        },

        //Set the given wheelchair index to be edited
        setEditWheelchair: function (index) {
          if (index >= 0 && index < designedWheelchairs.length) {
            curEditWheelchairIndex = index;
          }
          currentWheelchair.editingWheelchair = jQuery.extend(true, designedWheelchairs[index]);
          currentWheelchair.isNew = false;
        },

        //Removes the wheelchair at the given index from the user's myDesign
        deleteWheelchair: function (index) {
          designedWheelchairs.splice(index, 1);
        },

        //Returns the full array of user-defined wheelchairs
        getDesignedWheelchairs: function () {
          return designedWheelchairs;
        },

        getWheelchair: function (index) {
          if (index >= 0 && index < designedWheelchairs.length)
            return designedWheelchairs[index];
          return null;
        },

        //Returns the wheelchair currently set as "curEditWheelchair"
        //Returns null if no chair set as curEditWheelchair
        getCurEditWheelchair: function () {
          return currentWheelchair.editingWheelchair;
        },

        getNumDesignedWheelchairs: function () {
          return designedWheelchairs.length;
        },


        /******************************MY MEASUREMENTS*******************************/

        commonMeasures: {
          REAR_SEAT_HEIGHT: -1,
          REAR_SEAT_WIDTH: -1,
          FOLDING_BACKREST_HEIGHT: -1,
          AXEL_POSITION: -1,
          SEAT_DEPTH: -1
        },


        /******************************MY ORDERS*******************************/

        getAllOrders: function () {
          return orders;
        },
        getNumOrders: function () {
          return orders.length;
        },

        //Returns an array of all orders that have been sent (ignores "unsent" orders)
        getSentOrders: function () {
          var sentOrders = orders;
          if (sentOrders.length > 0) {
            var lastOrder = sentOrders[sentOrders.length - 1];
            if (!lastOrder.hasBeenSent())
              sentOrders.splice(sentOrders.length - 1, 1);
          }
          return sentOrders;
        },

        //Creates a new "unsent" order - overwriting a previous unset order if one exists
        createNewOrder: function () {
          if (orders.length > 0) {
            var lastOrder = orders[orders.length - 1];
            if (!lastOrder.hasBeenSent())
              orders.splice(orders.length - 1, 1);
          }

          var newOrder = new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE);
          orders.push(newOrder);
        },

        //Returns the unsent Order set as the "curEditOrder"
        //If no such Order exists, returns null
        getCurEditOrder: function () {
          if (orders.length > 0) {
            var lastOrder = orders[orders.length - 1];
            if (!lastOrder.hasBeenSent())
              return lastOrder;
          }
          return null;
        },

        //Returns the last order whether it is sent or unsent
        getLastOrder: function () {
          if (orders.length > 0) {
            return orders[orders.length - 1];
          }
        },

        //Sends the curEditOrder to the distributor
        sendCurEditOrder: function (userData, shippingData, payMethod) {
          var deferred = $q.defer();

          var editOrder = this.getCurEditOrder();
          if (editOrder === null)
            deferred.reject('CurEditOrder does not exist');

          editOrder.send(userID, userData, shippingData, payMethod)
            .then(function () {
              deferred.resolve();
            }, function (err) {
              deferred.reject(err);
            });

          return deferred.promise;
        },

        //***********get/sets
        getFname: function () {
          return fName;
        },
        getLname: function () {
          return lName;
        },
        getEmail: function () {
          return email;
        },
        getPhone: function () {
          return phone;
        },
        getAddr: function () {
          return addr;
        },
        getAddr2: function () {
          return addr2;
        },
        getCity: function () {
          return city;
        },
        getState: function () {
          return state;
        },
        getZip: function () {
          return zip;
        },
        getUnitSys: function () {
          return unitSys;
        },

        getFullName: function () {
          return fName + ' ' + lName;
        },
        getFullAddr: function () {
          var a2 = addr2;
          if (addr2 !== '')
            a2 = ' ' + a2;
          return addr + a2;
        },

        setFname: function (newFName) {
          fName = newFName;
        },
        setLname: function (newLName) {
          lName = newLName;
        },
        setEmail: function (newEmail) {
          email = newEmail;
        },
        setPhone: function (newPhone) {
          phone = newPhone;
        },
        setAddr: function (newAddr) {
          addr = newAddr;
        },
        setAddr2: function (newAddr2) {
          addr2 = newAddr2;
        },
        setCity: function (newCity) {
          city = newCity;
        },
        setState: function (newState) {
          state = newState;
        },
        setZip: function (newZip) {
          zip = newZip;
        },
        setUnitSys: function (newUnitSys) {
          unitSys = newUnitSys;
        }
      };

    }]);



