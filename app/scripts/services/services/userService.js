'use strict';

/**
 * @ngdoc function
 * @name abacuApp.serives:userService
 * @description
 * # userService  This is the app's top entity. It will generate every time app started to run. User will be divided into registered (with userID) and guest group(UserID is 0).
 * Service of the abacuApp
 */

/*
 *
 */
angular.module('abacuApp')
.service('User', ['$http', '$location', '$q', 'localJSONStorage', 'Order', 'Wheelchair', 'Units', 'Costs', 'Design',
 'Errors', 'PromiseUtils', '$rootScope', 'WheelchairUpdate', 'DesignUpdate', 'CartUpdate',
function ($http, $location, $q, localJSONStorage, Order, Wheelchair, Units, Costs, 
  Design, Errors, PromiseUtils, $rootScope, WheelchairUpdate, DesignUpdate, CartUpdate) {

  // declare all User variables here.
  // savedDesigns are the designs saved under account. This is feature only enables when user loggin.
  // currentwhelchair holds what goes into tinker page,
  // contentSection is the section indicator of my account function

  var self = this;

  // initialize all user variables here
  function init() {
    self.orders = [];
    self.cart = new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, null);
    self.currentWheelchair = { // indicate the status of current design and hold the wheelchair instance
      isNew: false,
      editingWheelchair: null,
      design: null
    };
    self.cartWheelchairIndex = -1;  //Index associate with cartWheelchairs i.e cartwheelchair
    self.savedDesigns = [];                    // array of saved wheelchair\
    self.userID = -1; //-1 means not logged in
    self.fName = '';
    self.lName = '';
    self.email = '';
    self.phone = '';
    self.addr = '';
    self.addr2 = '';
    self.city = '';
    self.state = '';
    self.zip = '';
    self.unitSys = Units.unitSys.IMPERIAL;   // no longer used
    self.contentSection = 'orders';          // section name under my account
    self.userType = '';
    self._rev = null;                        //revision number from cloudant, Important to keep in sync with, otherwise update will fail
    // restoreUserFromCookies();
  }

  init(); // initialize all the user variables

  function getDesigns() {
    var details = {
      'savedDesigns': self.savedDesigns.map(function (design) {
        if (design instanceof Design) {
          return design.allDetails();
        }
        return design;
      })
    };
    if (self._rev) {
      details._rev = self._rev;
    }

    return details;
  }

  function getCartItems() {
    var details = {
      'cart': !_.isNull(self.cart) ? self.cart.getAll() : null
    };

    return details;
  }

  //return all details of user object
  function allDetails() {
    var details = {
      'userID': self.userID,
      'fName': self.fName,
      'lName': self.lName,
      'email': self.email,
      'phone': self.phone,
      'addr': self.addr,
      'addr2': self.addr2,
      'city': self.city,
      'state': self.state,
      'zip': self.zip,
      'unitSys': self.unitSys,
      'currentWheelchair': self.currentWheelchair,
      'orders': self.orders.map(function (order) {
        return order.getAll();
      }),
      'savedDesigns': self.savedDesigns.map(function (design) {
        if (design instanceof Design) {
          return design.allDetails();
        }
        return design;
      }),
      'cart': !_.isNull(self.cart) ? self.cart.getAll() : null,
      'userType': self.userType
    };

    if (self._rev) { // attach the _rev only if it exists
      details._rev = self._rev;
    }

    return details;
  }

  //universal DB update. It fetched all the user details and upload to DB, it also update the local file when the data receive from DB
  //TODO: build different section update function to replace the universal update method

  function updateUserInfo(userInfo) {
    return $http({
      url: '/update-user-info'
      , data: userInfo
      , method: 'POST'
    }).then(function(data) {
      restoreUserInfo(data);
      return data.message;
    }, function(err) {
      console.log(err)
      throw new Error("function:", err);
    })
    .catch(function(err) {
      console.log("catch", err)
      throw new Error(err);
    });
  }

  //create a currentDesign object.
  function createCurrentDesign(frameID) {
    if (frameID instanceof Design) {
      var design = frameID; // frameID is actually a design instance
      self.currentWheelchair.isNew = !design.hasID();  // isNew: false: design is being re editing  true:this is a new design
      self.currentWheelchair.design = design;
    } else if (_.isObject(frameID)) { //frameID is a wheelchair instance
      self.currentWheelchair.design= new Design(frameID);
      self.currentWheelchair.isNew = true;
    } else if (_.isNumber(frameID)) { //frameID is a ID
      // its either an integer respresenting a frame id or a wheelchair object
      self.currentWheelchair.isNew = true;
      self.currentWheelchair.design = new Design({
        'creator': self.userID,
        'wheelchair': new Wheelchair(frameID)
      });
    } else {
      throw new Error('Bad value given to createCurrentDesign: ' + JSON.stringify(frameID));
    }

    // decide where to persist the currentWheelchair based on whether the user is logged in
    if (self.userID !== -1) {
      return WheelchairUpdate.update(self.currentWheelchair)
      .then(function(updatedWheelchair){
        self.currentWheelchair = updatedWheelchair;
      })
    } else {
      localJSONStorage.put('currentWheelchair', {frameID: frameID, isNew: true, index: -1});
      return PromiseUtils.resolved();
    }
  }

  //update cart wheelchair
  function updateCartWheelchair(index, design){
    self.cart.wheelchairs[index] = design;
  }

  //mark a design and send it to tinker page
  function setEditWheelchair(index, design) {
    if (index >= 0 && index < self.cart.wheelchairs.length) {
      self.cartWheelchairIndex = index;
    }
    
    self.currentWheelchair.isNew = false;   // mark the editing status of a wheelchair
    self.currentWheelchair.design = design;
    

    // decide where to persist the currentWheelchair based on whether the user is logged in
    if (self.userID !== -1) {
      return WheelchairUpdate.update(self.currentWheelchair)
        .then(function (updatedWheelchair) {
          self.currentWheelchair = updatedWheelchair;
          self.currentWheelchair.design._rev = self.cart.wheelchairs[index]._rev; // update the revision number
        });
    } else {
      localJSONStorage.put('currentWheelchair', {frameID: -1, isNew: false, index: index, 'design': design});
      return PromiseUtils.resolved();
    }
  }

  function setEditWheelchairFromMyDesign(index){
    if (index >= 0 && index < self.savedDesigns.length) {
      self.currentWheelchair.isNew = false;
      if (_.isString(self.savedDesigns[index])) {
        return this.fetchDesign(self.savedDesigns[index]).then(function(resp){
          self.savedDesigns[index] = resp;
          self.currentWheelchair.design = resp;
        })
      }
      self.currentWheelchair.design = self.savedDesigns[index];
    }

    if (self.userID !== -1) {
      return WheelchairUpdate.update(self.currentWheelchair)
        .then(function (updatedWheelchair) {
          self.currentWheelchair = updatedWheelchair;
          self.currentWheelchair.design._rev = self.savedDesigns[index]._rev;
        });
    } else {
      localJSONStorage.put('currentWheelchair', {frameID: -1, isNew: false, index: index, 'design': design});
      return PromiseUtils.resolved();
    }
  }

  //general restoration from local storage
  //TODO: possible to divided in to several restore function if needed
  function restoreUserFromCookies() {
    //***************Cookie restore***********
    var wIndex = 0;
    while (localJSONStorage.get('design' + wIndex)){
      var design = localJSONStorage.get('design' + wIndex);
      self.cart.wheelchairs.push(new Design(design));
      wIndex ++;
    }

    if (self.cart.wheelchairs.length > 0) {
      self.orders.push(self.cart);
    }

    var tempCurrentWheelchair = localJSONStorage.get('currentWheelchair');
    if (tempCurrentWheelchair != null) {
      if (tempCurrentWheelchair.isNew === true) {
        createCurrentDesign(tempCurrentWheelchair.frameID);
      }
      else if (tempCurrentWheelchair.isNew === false) {
        setEditWheelchair(tempCurrentWheelchair.index, new Design(tempCurrentWheelchair.design));
      }
    }

    // if(localJSONStorage.get('promo')) {                 //not storing promo code any more
    //   cart.discounts = localJSONStorage.get('promo');
    // }
  }

  function restoreUserInfo(data) {
    self.fName = data.user.fName;
    self.lName = data.user.lName;
    self.email = data.user.email;
    self.phone = data.user.phone;
    self.addr = data.user.addr;
    self.addr2 = data.user.addr2;
    self.city = data.user.city;
    self.state = data.user.state;
    self.zip = data.user.zip;
  } 

  function restoreUserFromBackend(data) {
    if (_.isEmpty(data) || !_.isObject(data)) {
      return;
    }

    self.userID = data.userID || data.email;

    if (self.userID !== -1) {
      self.fName = data.fName;
      self.lName = data.lName;
      self.email = data.email;
      self.phone = data.phone;
      self.addr = data.addr;
      self.addr2 = data.addr2;
      self.city = data.city;
      self.state = data.state;
      self.zip = data.zip;
      self.savedDesigns = !_.isArray(data.savedDesigns) ? [] : data.savedDesigns.map(function (designObj) {
        return _.isObject(designObj) ? new Design(designObj) : designObj; // might just be a design ID string
      });

      self.currentWheelchair = data.currentWheelchair || self.currentWheelchair;
      self.currentWheelchair.design = self.currentWheelchair.design ? new Design(self.currentWheelchair.design) : null;

      // Setup the cart...it is null if the user doesnt have a cart
      if (data.cart) {
        var cartID = data.cart.id || data.cart._id || null;
        var wIndex = 0;
        while (localJSONStorage.get('design' + wIndex)){
          var wheelchair = localJSONStorage.get('design' + wIndex);
          var temp = true;
          data.cart.wheelchairs.forEach(function(remoteWheelchair){
            temp = temp && (!_.includes(remoteWheelchair, wheelchair._id ));
          });
          if (temp)
            data.cart.wheelchairs.push(wheelchair);
          localJSONStorage.remove('design' + wIndex);
          wIndex++;
        }

        //important step to keep cart sync. update the reveision number
        self.cart = data.cart && cartID !== null ? new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, data.cart) : null;
        // updateDB();
      }

      //clear the local storage to avoid repetitive copy
      var wIndex = 0;
      while (localJSONStorage.get('design' + wIndex)){
        localJSONStorage.remove('design' + wIndex);
        wIndex++;
      }

      self.userType = data.userType;
      self._rev = data._rev || null;
      var orderObjs = _.isArray(data.orders) ? data.orders : [];
      self.orders = orderObjs.map(function (orderObj) {
        return new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, orderObj);
      });
    }
  }

  function getCurrentUser() {
    return $http({
      url: 'users/current'
      , method: 'GET'
    })
      .then(function (response) {
        if (response.data.userID === -1) {
          // this means user is not logged in
          restoreUserFromCookies();
        } else {
          restoreUserFromBackend(response.data);
        }

        return response.data;
      })
      .catch(function (err) {
        restoreUserFromCookies();
      });
  }

  //Make a request to /session. If it succeeds, restore user from response, otherwise, restore from settings
  var updatePromise = getCurrentUser();

//*********functions************//

  return {
    getCurrentUser: getCurrentUser,

    getPromise: function () {
      return updatePromise;
    },

    allDetails: allDetails,

    /**********design share/coEdit with ID*********/
    fetchDesign: function(id) {
      return $http({
        url:'/designs/' + id,
        data:{designID:id},
        method:'GET'
      })
        .then(function(response){
          var currentDesign = new Design(response.data);
          return currentDesign;
        });
    },

    saveDesign: function(design) {
      var deferred = $q.defer();
      var secDeferred = $q.defer();
      var instance = this;


      if (!this.isLoggedIn()) {   //test if user is loggin
        deferred.reject(new Errors.NotLoggedInError("Must Be Logged In"));
        return deferred.promise;
      }
      // $http({ ... }) returns a promise
      var designInstance = design instanceof Design ? design : new Design(design);
      return $http({
        url:'/designs',
        data: designInstance.clone().allDetails(),
        method: 'POST'
      })
        .then(function (response) {
          var newDesign = new Design(response.data);
          instance.addDesignIDToSavedDesigns(newDesign._id);
          return secDeferred.resolve;
        })
        .catch(function (err){
          console.log('save design gone wrong' + err);
        })
    },

    //save design method under abacus page. return a object instead of promise
    saveDesignForAbacus: function(design) {
      var deferred = $q.defer();
      var secDeferred = $q.defer();
      var instance = this;

      if (!this.isLoggedIn()) {
        deferred.reject(new Errors.NotLoggedInError("Must Be Logged In"));
        return deferred.promise;
      }
      // $http({ ... }) returns a promise
      var designInstance = design instanceof Design ? design : new Design(design);
      return $http({
        url:'/designs',
        data: designInstance.clone().allDetails(),
        method: 'POST'
      })
        .then(function (response) {
          var newDesign = new Design(response.data);
          // User.addDesignIDToSavedDesigns(newDesign._id);
          // this.addDesignIDToSavedDesigns(newDesign._id);
          return newDesign;
        })
        .catch(function (err){
          console.log('save design gone wrong' + err);
        })
    },

    updateDesign: function (design) {
      if (!this.isLoggedIn()) {
        return PromiseUtils.rejected(new Errors.NotLoggedInError("Must Be Logged In"));
      } else if (!(design instanceof Design) || !design.hasID()) {
        return PromiseUtils.rejected(new Error("Invalid design arg"));
      }
      var designDetails = design.allDetails();
      designDetails.updatedAt = new Date();
      return $http({
        url: '/designs/' + design._id,
        data: designDetails,
        method: 'PUT'
      })
        .then(function (res) {
          var designObj = res.data;
          return new Design(designObj);
        });
    },

    /************************LOGIN AND LOGOUT****************************/

    //Attempt to login as the given username with the given password
    //If successful - should load in appropriate user data
    login: function (in_email, pass) {
      var curThis = this;
      var deferred = $q.defer();

      if (!([in_email, pass].every(_.isString)) || [in_email, pass].some(_.isEmpty)) {
        deferred.reject(new Error('Missing Username or Password'));
        return deferred.promise;
      }
      var email = in_email.toLowerCase()
      console.log('userService Page',email)
      var httpPromise = $http({
        url: '/users/email/sign-in/' + email,
        data: {password: pass},
        method: 'POST'
      });

      // Update the updatepromise
      updatePromise = httpPromise;

      return httpPromise
        .then(function (response) {
          var data = response.data;
          self.userID = data.userID;
          if (self.userID !== -1) {
            restoreUserFromBackend(data);
            if (self.cart) {
              _.forEach(self.cart.wheelchairs, function(item){
                if (!item._id) {
                  $rootScope.$broadcast('userChange'); // let the user see the cart without waiting for the db to update
                  CartUpdate.update(getCartItems())
                  .then(function(updatedCart) {
                    self.cart = updatedCart;
                    $rootScope.$broadcast('userChange'); // update view once again in order for the latest design id to appear
                  });
                  return false;
                }
              })
            } else {
              $rootScope.$broadcast('userChange');
            }     
          } else {
            throw new Error('Incorrect email or password');

          }
        });
    },

    logout: function () {
      var cart = this.getCurEditOrder();
      init(); //restore user variables to intial value

      // If there is a current order the user is working on, dont lose it

      // this.cart.wheelchairs = cart.wheelchairs;
      self.orders = [];
      if (cart) {
        self.orders.push(cart);
      }

      $http({
        url: '/users/current/logout',
        method: 'POST'
      }).success(function (data) {
          $rootScope.$broadcast('userChange');
        })
        .error(function (data) {
          console.log('Request Failed');
        });
    },

    //Returns true if the user is logged in
    isLoggedIn: function () {
      return (self.userID !== -1);
    },

    updateUserInfo: updateUserInfo,

    updateCart: function () {
      if (this.isLoggedIn()) {
        return CartUpdate.update(getCartItems())
        .then(function(updatedCart) {
          self.cart = updatedCart;
        });
      } else {
        // sync in memory cart with cookie storage
        localJSONStorage.remove('design'+self.cart.wheelchairs.length);
        for (var i = 0; i < self.cart.wheelchairs.length; i++) {
          localJSONStorage.put('design' + i, self.cart.wheelchairs[i].allDetails());
        }

        return PromiseUtils.resolved(allDetails());
      }
    },


    /*************************MY DESIGNS*******************************/

    createCurrentDesign: createCurrentDesign,

    updateCartWheelchair: updateCartWheelchair,

    //clear all the local storage
    clearCart: function () {
      self.cart.wheelchairs.forEach(function (chair, idx) {
        localJSONStorage.remove('design' + idx); // clear the localStorage from the saved cart designs
      });

      localJSONStorage.remove('promo');

      self.cart = new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, null);
    },

    //Create a new wheelchair object of given frame type and set edit pointer to it
    pushNewWheelchair: function (wheelchair) {
      if (_.isNull(self.cart)) {
        console.log('cart is null')
        self.cart = new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, null);
      }
      self.currentWheelchair.design.wheelchair = wheelchair;
      if (self.currentWheelchair.isNew === true ) {
        self.cart.wheelchairs.push(self.currentWheelchair.design);
        self.cartWheelchairIndex = self.cart.wheelchairs.length - 1;  //
      }
      else if (self.currentWheelchair.isNew === false) {
        if (self.cartWheelchairIndex === -1 && _.isEmpty(self.cart.wheelchairs)) {
          self.cart.wheelchairs.push(self.currentWheelchair.design.clone()); // means the first chair theyre trying to add is someone elses
        } else {
          self.cart.wheelchairs[self.cartWheelchairIndex] = self.currentWheelchair.design;
        }
      }
      return this.updateCart();
    },

    //Set the given wheelchair index to be edited
    setEditWheelchair: setEditWheelchair,

    setEditWheelchairFromMyDesign: setEditWheelchairFromMyDesign,



    // Saves the currentWheelchair into the saved wheelchairs list and resets the currentWheelchair
    addDesignIDToSavedDesigns: function (designID) {
      self.savedDesigns = _.reject(self.savedDesigns, {'_id': designID});
      self.savedDesigns.push(designID);
      return DesignUpdate.update(self.savedDesigns)
      .then(function(updatedDesigns) {
        self.savedDesigns = updatedDesigns;
      })
    },

    //design can either be a design object or a design ID
    removeDesignFromSavedDesigns: function (design, andToCart) {
      var designID = _.isString(design) ? design : design._id;
      self.savedDesigns = _.reject(self.savedDesigns, {'_id': designID});
      if (self.savedDesigns.indexOf(designID) > -1) {
        _.remove(self.savedDesigns, function(item) {
          return item === designID;
        });
      }
      if (andToCart) {
        CartUpdate.update(getCartItems())
        .then(function(updatedCart) {
          self.cart = updatedCart;
        });
      }
      return DesignUpdate.update(self.savedDesigns)
      .then(function(updatedDesigns) {
        self.savedDesigns = updatedDesigns;
      })
    },

    //Removes the wheelchair at the given index from the user's myDesign
    deleteWheelchair: function (index) {
      self.cart.wheelchairs.splice(index, 1);
      return this.updateCart();
    },

    getCart: function () {
      return self.cart;
    },

    //Returns the full array of user-defined wheelchairs
    getCartWheelchairs: function () {
      if(_.isNull(self.cart)){
        return [];
      }
      return _.map(self.cart.wheelchairs, 'wheelchair');
    },


    //return specific wheelchair in the cart
    getWheelchair: function (index) {
      if (index >= 0 && index < self.cart.wheelchairs.length)
        return self.cart.wheelchairs[index];
      return null;
    },

    // returns full array of users wishlist/my design wheelchairs
    getSavedDesigns: function () {
      return self.savedDesigns;
    },

    getOneSavedDesign: function (index) {
      if (index >= 0 && index < self.savedDesigns.length) {
        return self.savedDesigns[index];
      } else {
        return null;
      }
    },

    //Returns the wheelchair currently set as "curEditWheelchair"
    //Returns null if no chair set as curEditWheelchair
    getCurrentWheelchair: function() {
      return {
        'currentWheelchair': self.currentWheelchair
      };
    },
    getCurEditWheelchair: function () {
      return self.currentWheelchair.design.wheelchair;
    },

    getCurEditWheelchairDesign: function () {
      return self.currentWheelchair.design;
    },

    isNewWheelchair: function () {
      return self.currentWheelchair.isNew;
    },

    getNumCartWheelchairs: function () {
      return _.isNull(self.cart) ? 0 : self.cart.wheelchairs.length;
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
      return self.orders;
    },
    getNumOrders: function () {
      return self.orders.length;
    },

    //Returns an array of all orders that have been sent (ignores "unsent" orders)
    getSentOrders: function () {
      return self.orders;
    },

    //Creates a new "unsent" order - overwriting a previous unset order if one exists
    createNewOrder: function () {
      var lastOrder = self.orders[self.orders.length - 1];
      if (self.orders.length === 0 || lastOrder.hasBeenSent()) {
        self.cart = new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, null);
      }
    },

    //Returns the unsent Order set as the "curEditOrder"
    //If no such Order exists, returns null
    getCurEditOrder: function () {
      return self.cart;
    },

    //Returns the last order whether it is sent or unsent
    getLastOrder: function () {
      if (self.orders.length > 0) {
        return self.orders[self.orders.length - 1];
      }
    },

    //Sends the curEditOrder to the distributor
    sendCurEditOrder: function (userData, shippingData, billingData, token, cc, checkNum) {
      var editOrder = this.getCurEditOrder();
      if (editOrder === null) {
        return PromiseUtils.rejected(new Error('CurEditOrder does not exist'));
      } else {
        return editOrder.send(self.userID, userData, shippingData, billingData, token, cc, checkNum)
          .then(function (response) {
            getCurrentUser();
            return response;
          });
      }
    },

    //***********get/sets
    getID: function () {
      return self.userID;
    },
    getFname: function () {
      return (self.fName.charAt(0).toUpperCase() + self.fName.slice(1));
    },
    getLname: function () {
      return (self.lName.charAt(0).toUpperCase() + self.lName.slice(1));
    },
    getEmail: function () {
      return self.email;
    },
    getPhone: function () {
      return self.phone;
    },
    getAddr: function () {
      return self.addr;
    },
    getAddr2: function () {
      return self.addr2;
    },
    getCity: function () {
      return self.city;
    },
    getState: function () {
      return self.state;
    },
    getZip: function () {
      return self.zip;
    },
    getUnitSys: function () {
      return self.unitSys;
    },

    getFullName: function () {
      return this.getFname() + ' ' + this.getLname();
    },
    getFullAddr: function () {
      var a2 = self.addr2;
      if (self.addr2 !== '')
        a2 = ' ' + a2;
      return self.addr + a2;
    },
    getContentSection: function () {
      return self.contentSection;
    },

    getUserType: function () {
      return self.userType;
    },
    setFname: function (newFName) {
      self.fName = newFName;
    },
    setLname: function (newLName) {
      self.lName = newLName;
    },
    setEmail: function (newEmail) {
      self.email = newEmail;
    },
    setPhone: function (newPhone) {
      self.phone = newPhone;
    },
    setAddr: function (newAddr) {
      self.addr = newAddr;
    },
    setAddr2: function (newAddr2) {
      self.addr2 = newAddr2;
    },
    setCity: function (newCity) {
      self.city = newCity;
    },
    setState: function (newState) {
      self.state = newState;
    },
    setZip: function (newZip) {
      self.zip = newZip;
    },
    setUnitSys: function (newUnitSys) {
      self.unitSys = newUnitSys;
    },
    setContentSection: function (newSection) {
      self.contentSection = newSection;
    },
    //mock setters only for testing purposes
    setUser: function () {
      self.userID = true;
    },
    setCart: function (data) {
      self.cart = data;
    },
    setDesign: function(designs) {
      self.savedDesigns = designs;
    },
    setCurrentWheelchair: function(wheelchair) {
      self.currentWheelchair = wheelchair;
    }
  };
}]);
