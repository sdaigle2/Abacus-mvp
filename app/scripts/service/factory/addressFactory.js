'use strict';

angular.module('abacuApp')
  .factory('Address', [function () {

    //##########################  Constructor  #########################
    function Address(addrData) {

      this.addressID = addrData.ID; //TODO: generate a new unique id for each address
      this.streetLine1 = addrData.streetLine1;
      this.streetLine2 = addrData.streetLine2;
      this.city = addrData.city;
      this.state = addrData.state;
      this.zip = addrData.zip;

    };


    /************instance functions**************/

    Address.prototype = {

      getID: function () { return this.addressID; },
      getStreetLine1: function () { return this.streetLine1; },
      getStreetLine2: function () { return this.streetLine2; },
      getCity: function () { return this.city; },
      getState: function () { return this.state; },
      getZipcode: function () { return this.zip; },

      setStreetLine1: function (newSL1) { this.streetLine1 = newSL1; },
      setStreetLine2: function (newSL2) { this.streetLine2 = newSL2; },
      setCity: function (newCity) { this.city = newCity; },
      setState: function (newState) { this.state = newState; },
      setZipcode: function (newZip) { this.zip = newZip; },

      getFullStreet: function () {
        return (this.streetLine2 === '' ? this.streetLine1 : this.getStreetLine1 + ' ' + this.streetLine2);
      }

    };

    //Don't touch this
    return (Address);
  }]);
