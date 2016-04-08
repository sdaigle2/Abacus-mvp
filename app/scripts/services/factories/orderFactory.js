'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static factory:orderFactory
 * @description
 * # orderFactory
 * Service of the abacuApp
 */

/*
 * This factory produces Order objects
 * An Order is a collection of designed wheelchairs and user data to be sent to the distributor
 * An Order is "sent" if it has a date set for sentDate - it is "unsent" if sentDate is null
 * User contains an array of Orders
 * User also keeps track of one unsent Order, which is used as the cart
 * Order contains various aggregation functions which calculate the subtotal, shipping fee, tax, and total costs
 * Order has a function send() which accepts finalized user data and sends itself to the distributor, marking itself as sent
 * Orders can be constructed directly from a JSON object using the Order.fromJSONData() function
 */
angular.module('abacuApp')
  .constant('FRAME_SHIPPING_PRICES', {'CHAIR': 47.98, 'WHEEL': 18.45})
  .constant('USER_TYPES', [{'name': 'User', 'requiresAccount': false}, {'name': 'Dealer', 'requiresAccount': true}, {'name': 'VA', 'requiresAccount': true}, {'name': 'P4X Sales Rep', 'requiresAccount': true}])
  .factory('Order', ['$q', '$http', 'Wheelchair', 'localJSONStorage', 'Design', 'FRAME_SHIPPING_PRICES', 'FrameData', 'Discount', 'Errors','_', function ($q, $http, Wheelchair, localJSONStorage, Design, FRAME_SHIPPING_PRICES, FrameData, Discount, Errors, _) {

    function Order(taxRate, shippingFee, order) {
      this.wheelchairs = [];
      var DEFAULT_DETAILS = {
        'fName': '',
        'lName': '',
        'addr': '',
        'addr2': '',
        'city': '',
        'state': '',
        'zip': ''
      };
      if (order == null) {
        this._id = -1;
        this._rev = null;
        this.orderNum = 'OrderNumNotSet';
        this.taxRate = taxRate;
        this.shippingFee = shippingFee;
        this.sentDate = null; //null = "unsent"
        this.email = '';
        this.phone = '';
        this.poNumber = '';

        this.userID = -1;
        this.shippingDetails = _.clone(DEFAULT_DETAILS);

        this.billingDetails = _.clone(DEFAULT_DETAILS);

        this.userType = 'User'; // default to the 'User' User Type

        this.payMethod = 'Credit Card';
        this.discounts = [];
      }
      else {
        this._id = order._id || order.id  || -1;
        this._rev = order._rev || order.rev || null;
        this.orderNum = order.orderNum;
        this.taxRate = order.taxRate;
        this.shippingFee = order.shippingFee;
        this.sentDate = new Date(order.sentDate);
        this.userID = order.userID;
        this.email = order.email;
        this.phone = order.phone;
        this.shippingDetails = _.defaults(order.shippingDetails || {}, DEFAULT_DETAILS);
        this.billingDetails = _.defaults(order.billingDetails || {}, DEFAULT_DETAILS);
        this.payMethod = order.payMethod || 'Credit Card'; // default to credit card
        this.userType = order.userType || 'User'; // default to user
        this.poNumber = order.poNumber || '';

        order.discounts = _.isArray(order.discounts) ? order.discounts : [];
        this.discounts = order.discounts.map(function (discountObj) {
          return new Discount(discountObj);
        });

        this.wheelchairs = order.wheelchairs.map(function (wheelchairDesign) {
          return new Design(wheelchairDesign);
        });
      }
    }


    function updateOrderCookie (orderInfo, wheelchairs) {
      localJSONStorage.put('cartInfo', orderInfo);
      var tempWheelchairs = [];
      for (var i = 0; i < wheelchairs.length; i++) {
        tempWheelchairs.push(wheelchairs[i].allDetails());
      }
      localJSONStorage.put('cartWheelchairs', tempWheelchairs);
    }



    Order.prototype = {

      isValidOrder: function () {
        // Only checks that the order contains at least one wheelchair and that if
        // any of the discounts are not multi discounts, then there's only one discount being applied
        if (_.isEmpty(this.wheelchairs)) {
          return false;
        }

        if (!this.canAddDiscount() && this.discounts.length > 1) {
          return false; // you've mixed a discount with another nonmultidiscount discount
        }

        return true;
      },

      canAddDiscount: function () {
        return _.every(this.discounts, 'isMultiDiscount');
      },

      addDiscount: function (discount) {
        if (discount instanceof Discount && this.canAddDiscount()) {
          if (discount.isExpired()) {
            throw new Errors.ExpiredDiscountError("This Discount has Expired");
          }

          if (this.discounts.length > 0 && !discount.isMultiDiscount) {
            throw new Errors.CantCombineDiscountError("This discount can't be combined with other discounts");
          }

          this.discounts.push(discount);
          this.discounts = _.uniqBy(this.discounts, '_id'); // remove any duplicate discounts
        } else {
          throw new Errors.CantAddDiscountError('Input to order.addDiscount() must be instance of Discount & must be valid discount combination');
        }
      },

      addWheelchair: function (newDesign) {
        if (newDesign instanceof Design) {
          this.wheelchairs.push(newDesign);
        } else {
          throw new Error('Input to order.addWheelchair must be an instance of a Design');
        }
      },

      removeWheelchair: function (index) {
        if (index >= 0 && index < this.wheelchairs.length) {
          this.wheelchairs[index].toggleInOrder();
          return this.wheelchairs.splice(index, 1);
        }
        return null;
      },

      //**************gets/sets************/

      getAll: function () {
        var details = {
          orderNum: this.orderNum,
          taxRate: this.taxRate,
          shippingFee: this.shippingFee,
          sentDate: this.sentDate,
          userID: this.userID,
          email: this.email,
          phone: this.phone,
          shippingDetails: this.shippingDetails,
          billingDetails: this.billingDetails,
          payMethod: this.payMethod,
          poNumber: this.poNumber,
          wheelchairs: this.wheelchairs.map(function (design) {
            return design.allDetails();
          }),
          discounts: this.discounts
        };

        if (this._id && this._id !== -1) {
          details._id = this._id;
        }

        if (this._rev) { // only attach _rev if it exists
          details._rev = this._rev;
        }

        return details;
      },

      getOrderInfo: function () {
        return {
          orderNum: this.orderNum,
          taxRate: this.taxRate,
          shippingFee: this.shippingFee,
          sentDate: this.sentDate,
          userID: this.userID,
          fName: this.fName,
          lName: this.lName,
          email: this.email,
          phone: this.phone,
          addr: this.addr,
          addr2: this.addr2,
          city: this.city,
          state: this.state,
          zip: this.zip,
          paymethod: this.paymethod,
          wheelchairs: this.wheelchairs.map(function (w) {
            return w.allDetails();
          }),
          poNumber: this.poNumber,
          discounts: this.discounts
        };
      },

      getDiscounts: function () {
        return this.discounts;
      },
      getPayMethod: function () {
        return this.payMethod;
      },
      getTaxRate: function () {
        return this.taxRate;
      },
      getOrderNum: function () {
        return this.orderNum;
      },
      getWheelchairs: function () {
        return this.wheelchairs;
      },
      getNumWheelchairs: function () {
        return this.wheelchairs.length;
      },
      getSentDate: function () {
        return this.sentDate;
      },
      getUserID: function () {
        return this.userID;
      },
      getEmail: function () {
        return this.email;
      },
      getPhone: function () {
        return this.phone;
      },
      getPONumber: function () {
        return this.poNumber;
      },

      getFullName: function () {
        return this.fName + ' ' + this.lName;
      },
      getFullAddr: function () {
        var a2 = this.addr2;
        if (this.addr2 !== '')
          a2 = ' ' + a2;
        return this.addr + a2;
      },

      getFormattedAddr: function () {
        var fullAddr = this.addr;
        if (this.addr2 !== '') {
          fullAddr += '<br>' + this.addr2;
        }
        fullAddr += '<br>' + this.city + ', ' + this.state + ', ' + this.zip;
        return fullAddr;
      },

      //The Order is "sent" if sentDate is non-null
      hasBeenSent: function () {
        return this.sentDate !== null;
      },

      getWheelchair: function (index) {
        if (index >= 0 && index < this.wheelchairs.length)
          return this.wheelchairs[index].wheelchair;
        return null;
      },

      getAllWheelchair: function () {
      return this.wheelchairs;
    },

      /*****************Cost Calculators (Aggregate Functions)****************/

      //The combined cost of all the Wheelchairs in the Order
      getSubtotal: function () {
        return _.sumBy(this.wheelchairs, function (design) {
          return design.wheelchair.getTotalPrice();
        });
      },

      // Returns amount of money to take off of subtotal given the current discounts in the order
      getDiscountAmount: function () {
        var subtotal = this.getSubtotal();
        var discountPercent = _.sumBy(this.discounts, 'percent');
        return subtotal * discountPercent;
      },

      //The estimated cost of shipping this Order
      getShippingCost: function () {
        var orderInstance = this;
        return _.sumBy(this.wheelchairs, function (design) {
          var frameID = design.wheelchair.frameID;
          return FrameData.getFrame(frameID).getShippingCost();
        });
      },

      //The Tax to be paid for this Order
      getTaxCost: function () {
        return this.getSubtotal() * this.getTaxRate();
      },

      //The sum of Subtotal, Shipping Cost, and Tax Cost
      getTotalCost: function () {
        return this.getSubtotal() + this.getShippingCost() + this.getTaxCost() - this.getDiscountAmount();
      },



      /********************Saving to DB***********************/

      //This asyncronous funtion takes in various user information
      //and sends the Order to the distibutor with it.
      //This method also saves the Order to the database and marks it as "sent"
      send: function (userID, userData, shippingData, billingData, payMethod, token) {
        //Need a reference to the current scope when inside the callback function
        var curThis = this;

        //Save userData, shippingData, and payMethod into Order
        this.userID = userID;
        this.email  = userData.email;
        this.phone  = userData.phone;

        this.shippingDetails.fName = shippingData.fName;
        this.shippingDetails.lName = shippingData.lName;
        this.shippingDetails.addr  = shippingData.addr;
        this.shippingDetails.addr2 = shippingData.addr2;
        this.shippingDetails.city  = shippingData.city;
        this.shippingDetails.state = shippingData.state;
        this.shippingDetails.zip   = shippingData.zip;

        this.billingDetails.fName = billingData.fName;
        this.billingDetails.lName = billingData.lName;
        this.billingDetails.addr  = billingData.addr;
        this.billingDetails.addr2 = billingData.addr2;
        this.billingDetails.city  = billingData.city;
        this.billingDetails.state = billingData.state;
        this.billingDetails.zip   = billingData.zip;

        this.payMethod = payMethod;
        this.sentDate  = new Date(); //Set date to now - doing this marks this Order as "sent"

        return $http({
          url: '/order',
          data: {order: this.getAll(), token: token, totalPrice: this.getTotalCost()},
          method: 'POST'
        })
        .then(function(data) {
          if (!data.err) {
            curThis.orderNum = data;
          } else {
            curThis.orderNum = -1;
            alert('error processing order:'+ data.err);
          }

          for(var i=0; i<curThis.wheelchairs.length; i++)
            curThis.wheelchairs[i].wheelchair.toggleInOrder();
        });
      }
    };

    //Create an order object using data from JSON
    Order.fromJSONData = function (jsonData) {
      var newOrder = new Order(jsonData.taxRate, jsonData.shippingFee);
      newOrder.orderNum = jsonData.orderNum;
      newOrder.payMethod = jsonData.payMethod;
      newOrder.userID = jsonData.userID;
      newOrder.sentDate = jsonData.sentDate; //TODO: Need to convert?
      newOrder.phone = jsonData.phone;
      newOrder.email = jsonData.email;
      newOrder.billingDetails = jsonData.billingDetails;
      newOrder.shippingDetails = jsonData.shippingDetails;
      for (var i = 0; i < jsonData.wheelchairs.length; i++) {
        newOrder.addWheelchair(new Design(jsonData.wheelchairs[i]));
      }
      newOrder.sentDate = jsonData.sentDate;
      return newOrder;
    };

    return (Order);
  }

  ])
;
