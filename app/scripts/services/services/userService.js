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
  .service('User', ['$http', '$location', '$q', 'localJSONStorage', 'Order', 'Wheelchair', 'Units', 'Costs', 'Design', 'Errors',
    function ($http, $location, $q, localJSONStorage, Order, Wheelchair, Units, Costs, Design, Errors) {

      // declare all User variables here
      var orders, currentWheelchair, cartWheelchairIndex, savedDesigns,
      userID, fName, lName, email, phone, addr, addr2, city, state,
      zip, unitSys, contentSection, cart, isAdmin, _rev;

      // initialize all user variables here
      function init() {
        orders = [];     // TODO: only keep order variable.
        cart = new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, null);
        currentWheelchair = { // indicate the status of current design and hold the wheelchair instance
          isNew: false,
          editingWheelchair: null,
          design: null
        };
        cartWheelchairIndex = -1;  //Index associate with cartWheelchairs i.e cartwheelchair
        savedDesigns = [];                    // array of saved wheelchair\
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
        contentSection = 'orders';
        isAdmin = false;
        _rev = null;
      }

      var instance = this;

      init(); // initialize all the user variables

      function allDetails() {
        var details = {
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
          'currentWheelchair': currentWheelchair,
          'orders': orders.map(function (order) {
            return order.getAll();
          }),
          'savedDesigns': savedDesigns.map(function (design) {
            if (design instanceof Design) {
              return design.allDetails();
            }
            return design;
          }),
          'cart': !_.isNull(cart) ? cart.getAll() : null,
          'isAdmin': isAdmin
        };

        if (_rev) { // attach the _rev only if it exists
          details._rev = _rev;
        }

        return details;
      }

      function updateDB() {
        if (userID !== -1) {
          return $http({
            url: '/update',
            data: allDetails(),
            method: 'POST'
          })
          .then(function (response) {
            // TODO: Update the revisions for all the design objects here
            var userData = response.data.user;
            restoreUserFromBackend(userData);
            return userData;
          })
          .catch(function (err) {
            console.log('Request Failed: ' + err);
          });
        } else {
          var deferred = $q.defer();
          deferred.reject(Errors.NotLoggedInError('User Must Be Logged In For This Action'));
          return deferred.promise;
        }
      }

      function createCurrentDesign(frameID) {
        if (frameID instanceof Design) {
          var design = frameID; // frameID is actually a design instance
          currentWheelchair.editingWheelchair = design.wheelchair;
          currentWheelchair.isNew = userID === -1 || design.creator !== userID;
          currentWheelchair.design = design;
        } else {
          // its either an integer respresenting a frame id or a wheelchair object
          currentWheelchair.editingWheelchair = new Wheelchair(frameID);
          currentWheelchair.isNew = true;
          currentWheelchair.design = null;
        }

        // decide where to persist the currentWheelchair based on whether the user is logged in
        if (userID !== -1) {
          //updateDB();
        } else {
          localJSONStorage.put('currentWheelchair', {frameID: frameID, isNew: true, index: -1});
        }
      }

      function setEditWheelchair(index, orderInd) {
        if (index >= 0 && index < cart.wheelchairs.length) {
          cartWheelchairIndex = index;
        }
        currentWheelchair.editingWheelchair = $.extend(true, cart.wheelchairs[index]);
        currentWheelchair.isNew = false;
        currentWheelchair.orderInd = orderInd;

        // decide where to persist the currentWheelchair based on whether the user is logged in
        if (userID !== -1) {
          updateDB();
        } else {
          localJSONStorage.put('currentWheelchair', {frameID: -1, isNew: false, index: index});
        }
      }

      function restoreUserFromCookies() {
        //***************Cookie restore***********
        var wIndex = 0;
        while (localJSONStorage.get('design' + wIndex)){
          var design = localJSONStorage.get('design' + wIndex);
          cart.wheelchairs.push(new Design(design));
          wIndex ++;
        }

        if (cart.wheelchairs.length > 0) {
          orders.push(cart);
        }

        var tempCurrentWheelchair = localJSONStorage.get('currentWheelchair');
        if (tempCurrentWheelchair != null) {
          if (tempCurrentWheelchair.isNew === true) {
            createCurrentDesign(tempCurrentWheelchair.frameID);
          }
          else if (tempCurrentWheelchair.isNew === false) {
            setEditWheelchair(tempCurrentWheelchair.index);
          }
        }
      }

      function restoreUserFromBackend(data) {
        console.log(data);
        userID = data.userID || data.email;

        if (userID !== -1) {
          fName = data.fName;
          lName = data.lName;
          email = data.email;
          phone = data.phone;
          addr = data.addr;
          addr2 = data.addr2;
          city = data.city;
          state = data.state;
          zip = data.zip;
          savedDesigns = !_.isArray(data.savedDesigns) ? [] : data.savedDesigns.map(function (designObj) {
            return _.isObject(designObj) ? new Design(designObj) : designObj; // might just be a design ID string
          });

          currentWheelchair = data.currentWheelchair || currentWheelchair;
          currentWheelchair.editingWheelchair = currentWheelchair.editingWheelchair ? new Wheelchair(currentWheelchair.editingWheelchair) : currentWheelchair.editingWheelchair;
          currentWheelchair.design = currentWheelchair.design ? new Design(currentWheelchair.design) : null;

          // Setup the cart...it is null if the user doesnt have a cart
          if (data.cart) {
            var cartID = data.cart.id || data.cart._id || null;
            cart = data.cart && cartID !== null ? new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, data.cart) : null;
          } else {
            cart = new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, null);
          }

          isAdmin = data.isAdmin || false;
          _rev = data._rev || null;

          for (var i = 0; i < data.orders.length; i++) {
            orders.push(new Order(0, 0, data.orders[i]));
          }
        }
      }

      function restoreMyDesign(ID){
        return $http({
          url:'loadMyDesign',
          data: {email:ID},
          method:'GET'
        })
          .then(function(res){
            var data = res.data;

          })
      }



       //Make a request to /session. If it succeeds, restore user from response, otherwise, restore from settings
      var updatePromise = $http({
        url: '/session'
        , method: 'POST'
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
          console.log(err);
          restoreUserFromCookies();
        });


//*********functions************//

      return {

        getPromise: function () {
          return updatePromise;
        },

        allDetails: allDetails,

        /**********design share/coEdit with ID*********/
        fetchDesign: function(id) {
          return $http({
            url:'/design/' + id,
            data:{designID:id},
            method:'GET'
          })
          .then(function(response){
            //TODO load the design into current editing wheelchair variable
            var currentDesign = new Design(response.data);
            return currentDesign;
          });
        },

        saveDesign: function(design) {
          if (!this.isLoggedIn()) {
            var deferred = $q.defer();
            deferred.reject(new Errors.NotLoggedInError("Must Be Logged In"));
            return deferred.promise;
          }
          // $http({ ... }) returns a promise
          return $http({
            url:'/design',
            data: design instanceof Design ? design.allDetails() : design,
            method: 'POST'
          })
          .then(function (response) {
            return new Design(response.data);
          });
        },

        updateDesign: function (design) {
          if (!this.isLoggedIn()) {
            var deferred = $q.defer();
            deferred.reject(new Errors.NotLoggedInError("Must Be Logged In"));
            return deferred.promise;
          } else if (!(design instanceof Design) || !design.hasID()) {
            var deferred = $q.defer();
            deferred.reject(new Error("Invalid design arg"));
            return deferred.promise;
          }

          var designDetails = design.allDetails();
          designDetails.updatedAt = new Date();
          return $http({
            url: '/design/' + design._id,
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

          return $http({
            url: '/login',
            data: {email: in_email, password: pass},
            method: 'POST'
          })
          .then(function (response) {
            var data = response.data;
            console.log(data);
            userID = data.userID;
            if (userID !== -1) {
              restoreUserFromBackend(data);
              restoreMyDesign(in_email);
            } else {
              throw new Error('Incorrect email or password');

            }
          })
          .catch(function (err) {
            console.log('Request Failed: ' + JSON.stringify(err));
            deferred.reject(new Error('Incorrect email or password'));
            return deferred.promise;
          });
        },

        logout: function () {
          init(); //restore user variables to intial value

          // If there is a current order the user is working on, dont lose it
          var cart = this.getCurEditOrder();
          orders = [];
          if (cart) {
            orders.push(cart);
          }

          $http({
            url: '/logout',
            method: 'POST'
          }).success(function (data) {
            console.log(data);
          })
          .error(function (data) {
            console.log('Request Failed: ' + data);
          });
        },

        //Returns true if the user is logged in
        isLoggedIn: function () {
          return (userID !== -1);
        },

        updateDB: updateDB,

        updateCart: function () {
          console.log('design'+cart.wheelchairs.length);

          if (this.isLoggedIn()) {
            return this.updateDB();
          } else {
            // sync in memory cart with cookie storage
            localJSONStorage.remove('design'+cart.wheelchairs.length);
            for (var i = 0; i < cart.wheelchairs.length; i++) {
              localJSONStorage.put('design' + i, cart.wheelchairs[i].allDetails());
            }

            // Sent a successfull promise resolved to the current user object
            var deferred = $q.defer();
            deferred.resolve(allDetails());
            return deferred.promise;
          }
        },


        /*************************MY DESIGNS*******************************/

        createCurrentDesign: createCurrentDesign,

        //Create a new wheelchair object of given frame type and set edit pointer to it
        pushNewWheelchair: function () {
          if (_.isNull(cart)) {
            cart = new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, null);
          }

          if (currentWheelchair.isNew === true ) {
            cart.wheelchairs.push(new Design({
              'wheelchair': currentWheelchair.editingWheelchair
            }));
            cartWheelchairIndex = cart.wheelchairs.length - 1;
          }
          else if (currentWheelchair.isNew === false) {
            cart.wheelchairs[cartWheelchairIndex] = $.extend(true, currentWheelchair.editingWheelchair);
            var order = this.getCurEditOrder();
            if(order && currentWheelchair.orderInd >= 0) {
              order.wheelchairs[currentWheelchair.orderInd] = cart.wheelchairs[cartWheelchairIndex];
            }
          }
          return this.updateCart();
        },

        //Set the given wheelchair index to be edited
        setEditWheelchair: setEditWheelchair,

        // Saves the currentWheelchair into the saved wheelchairs list and resets the currentWheelchair
        addDesignIDToSavedDesigns: function (designID) {
          savedDesigns = _.reject(savedDesigns, {'_id': designID});
          savedDesigns.push(designID);
          return this.updateDB();
        },

        //Removes the wheelchair at the given index from the user's myDesign
        deleteWheelchair: function (index) {
          cart.wheelchairs.splice(index, 1);
          this.updateCart();
        },

        getCart: function () {
          return cart;
        },

        //Returns the full array of user-defined wheelchairs
        getCartWheelchairs: function () {
          if(_.isNull(cart)){
            return [];
          }
          return _.map(cart.wheelchairs, 'wheelchair');
        },



        getWheelchair: function (index) {
          if (index >= 0 && index < cartWheelchairs.length)
            return cartWheelchairs[index];
          return null;
        },

        // returns full array of users wishlist/my design wheelchairs
        getSavedDesigns: function () {
          return savedDesigns;
        },

        getSavedDesign: function (index) {
          if (index >= 0 && index < savedDesigns.length) {
            return savedDesigns[index];
          } else {
            return null;
          }
        },

        //Returns the wheelchair currently set as "curEditWheelchair"
        //Returns null if no chair set as curEditWheelchair
        getCurEditWheelchair: function () {
          return currentWheelchair.editingWheelchair;
        },

        getCurEditWheelchairDesign: function () {
          return currentWheelchair.design;
        },

        isNewWheelchair: function () {
          return currentWheelchair.isNew;
        },

        getNumCartWheelchairs: function () {
          return _.isNull(cart) ? 0 : cart.wheelchairs.length;
        },

        saveComputer: function () {
          var curThis = this;
          $http.post('/save', {wheelchair: this.getCurEditWheelchair().getAll()}, {responseType: 'blob'})
            .success(function (response) {
              saveAs(response, curThis.getCurEditWheelchair().title+'.pdf');
            });
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
          var lastOrder = orders[orders.length - 1];
          if (orders.length === 0 || lastOrder.hasBeenSent()) {
            console.log("create a new order")
            cart = new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, null);
          }
        },

        //Returns the unsent Order set as the "curEditOrder"
        //If no such Order exists, returns null
        getCurEditOrder: function () {
          return cart;
        },

        //Returns the last order whether it is sent or unsent
        getLastOrder: function () {
          if (orders.length > 0) {
            return orders[orders.length - 1];
          }
        },

        //Sends the curEditOrder to the distributor
        sendCurEditOrder: function (userData, shippingData, payMethod, token) {
          var deferred = $q.defer();

          var editOrder = this.getCurEditOrder();
          if (editOrder === null)
            deferred.reject('CurEditOrder does not exist');

          editOrder.send(userID, userData, shippingData, payMethod, token)
            .then(function () {
              deferred.resolve();
            }, function (err) {
              deferred.reject(err);
            });

          return deferred.promise;
        },

        //***********get/sets
        getID: function () {
          return userID;
        },
        getFname: function () {
          return (fName.charAt(0).toUpperCase() + fName.slice(1));
        },
        getLname: function () {
          return (lName.charAt(0).toUpperCase() + lName.slice(1));
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
          return this.getFname() + ' ' + this.getLname();
        },
        getFullAddr: function () {
          var a2 = addr2;
          if (addr2 !== '')
            a2 = ' ' + a2;
          return addr + a2;
        },
        getContentSection: function () {
          return contentSection;
        },
        isAdmin: function () {
          return isAdmin;
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
        },
        setContentSection: function (newSection) {
          contentSection = newSection;
        }
      };

    }])
;



