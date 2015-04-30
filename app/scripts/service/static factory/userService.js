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
  .service('UserData', ['$http', 'Order', 'Wheelchair', function ($http, Order, Wheelchair) {

    var fName = "";
    var lName = "";
    var email = "";
    var phone = "";

    var addr = "";
    var addr2 = "";
    var city = "";
    var state = "";
    var zip = "";

    var orders = [];
    var measures = [];
    var designedWheelchairs = [];

    var curEditWheelchairIndex = -1;

    //*********functions************//

    //Loads all orders from DB into this.orders using given orderIDs
    function loadOrders(orderIDs) {
      orders = [];
      $.getJSON('data/orderData.json')
        .done(function (json) {
          for (var i = 0; i < orderIDs.length; i++) {
            for (var j = 0; j < json.length; j++) {
              if (json[j].orderID === orderIDs[i]) {
                orders.push(new Order(json[j]));
                break;
              }
            }
          }
        })
        .fail(function (jqxhr, textStatus, error) {
          var err = textStatus + ', ' + error;
          console.log('Request Failed: ' + err);
        });
    };


    return {
      
      //Attempt to login as the given username with the given password
      //If successful - should load in appropriate user data
      login: function (username, password) {
        //TODO: Verify user-password against database
        //Remainder of function should be in verification callback

        //TODO: Write remainder of function
      },

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

      getcurEditWheelchair: function () { return getWheelchair(curEditWheelchairIndex); }


      //TODO: get/sets
    };

  }]);



