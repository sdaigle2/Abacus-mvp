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
  .service('User', ['$http', 'Order', 'Wheelchair', function ($http, Order, Wheelchair) {

    var userID = -1; //-1 means not logged in

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

    return {

      //Attempt to login as the given username with the given password
      //If successful - should load in appropriate user data
      login: function (username, password) {
        //TODO: Actually write function

        //Verify username and password
        //Set userID
        //Set other user fields
        //loadOrders()
        //loadDesignedWheelchairs()
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

      getCurEditWheelchair: function () {
        return this.getWheelchair(curEditWheelchairIndex);
      },

      //Returns User's name and address info as an object
      getUserDataAsObject: function () {
        return {
          fName: fName,
          lName: lName,
          email: email,
          phone: phone,
          addr: addr,
          addr2: addr2,
          city: city,
          state: state,
          zip: zip
        };
      }

      //TODO: get/sets
    };

  }]);



