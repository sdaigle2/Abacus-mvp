'use strict';

/*
* This Factory creates a Discount object
* An order can have multiple discount objects
* When calculating the price of an order, discounts specify how much percent to take off of each orders SubTotal price
* 
* Some disounts can be used with other discounts. For those discounts, the 'isMultiDiscount' will be set to true
* Other discounts cannot be used with other discounts. For these, 'isMultiDiscount' is false
*/


angular.module('abacuApp')
  .constant('DEFAULT_DISCOUNT', {
        '_id': null,
        '_rev': null,
        'percent': 0, // Percent to take OFF the order SubTotal
        'isMultiDiscount': false,
        'startDate': new Date(0), // Default to Jan 1, 1970...which means default is expired
        'endDate': new Date(0) // Default to Jan 1, 1970...which means default is expired
  })
  .factory('Discount', ['_', 'DEFAULT_DISCOUNT', '$http', 'PromiseUtils', function (_, DEFAULT_DISCOUNT, $http, PromiseUtils) {
  	var Discount = function (discountObj) {
      this._id = discountObj._id || discountObj.id || DEFAULT_DISCOUNT._id; // expect _id field to either be '_id' or 'id'
      this._rev = discountObj._rev || discountObj.rev || DEFAULT_DISCOUNT._rev; // expect _rev field to either be '_rev' or 'rev'
      this.percent = discountObj.percent || DEFAULT_DISCOUNT.percent;
      this.isMultiDiscount = _.isBoolean(discountObj.isMultiDiscount) ? discountObj.isMultiDiscount ? DEFAULT_DISCOUNT.isMultiDiscount;
      this.startDate = discountObj.startDate || DEFAULT_DISCOUNT.startDate;
      this.endDate = discountObj.endDate || DEFAULT_DISCOUNT.endDate;

      // Manually change the date fields into dates if they arent already
      this.startDate = _.isDate(this.startDate) ? this.startDate : new Date(this.startDate);
      this.endDate = _.isDate(this.endDate) ? this.endDate : new Date(this.endDate);

      Discount.prototype.isExpired = function () {
        var currentDate = new Date(); // current time
        return currentDate >= this.startDate && currentDate < this.endDate;
      };

      Discount.prototype.allDetails = function () {
        var details = {
          'percent': this.percent,
          'isMultiDiscount': this.isMultiDiscount,
          'startDate': this.startDate,
          'endDate': this.endDate
        };

        if (this._id) {
          details._id = this._id;
        }

        if (this._rev) {
          details._rev = this._rev;
        }

        return details;
      };


  	};

    // Attach static methods
    Discount.fetchDiscount = function (discountID) {
      if (!_.isString(discountID) || _.isEmpty(discountID)) {
        var err = new Error('Bad Input to Discount.fetchDiscount(id): ' + JSON.stringify(discountID, null, 2));
        return PromiseUtils.rejected(err);
      }

      return $http({
        url: '/discount/' + discountID,
        method: 'GET'
      })
      .then(function (response) {
        var discountObj = response.data;
        return new Discount(discountObj);
      });
    };

    Discount.getDiscountDetails = function (discount) {
      if (!(discount instanceof Discount)) {
        throw new Error('Input to Discount.getDiscountDetails() must be a Discount instance');
      }

      return discount.allDetails();
    };

    return Discount;
  }]);