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
      var orders, currentWheelchair, cartWheelchairs, cartWheelchairIndex, savedChairs,
      userID, fName, lName, email, phone, addr, addr2, city, state,
      zip, unitSys, contentSection, curOrder, isAdmin;

      // initialize all user variables here
      function init() {
        orders = [];     // TODO: only keep order variable.
        curOrder = new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, null);
        currentWheelchair = { // indicate the status of current design and hold the wheelchair instance
          isNew: false,
          editingWheelchair: null,
          design: null
        };
        cartWheelchairs = [];     //array of chairs in cart
        cartWheelchairIndex = -1;  //Index associate with cartWheelchairs i.e cartwheelchair
        savedChairs = [];                    // array of saved wheelchair\
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
      }

      var instance = this;

      init(); // initialize all the user variables

      function allDetails() {
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
          'currentWheelchair': currentWheelchair,
          'orders': orders.map(function (order) {
            return order.getAll();
          }),
          'cartWheelchairs': cartWheelchairs.map(function (wheelchair) {
            return wheelchair.getAll();
          }),
          'isAdmin': isAdmin
        };
      }

      function updateDB() {
        if (userID !== -1) {
          return $http({
            url: '/update',
            data: allDetails(),
            method: 'POST'
          })
          .then(function (data) {
            console.log(data);
          })
          .catch(function (data) {
            console.log('Request Failed: ' + data);
          });
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
          updateDB();
        } else {
          localJSONStorage.put('currentWheelchair', {frameID: frameID, isNew: true, index: -1});
        }
      }

      function setEditWheelchair(index, orderInd) {
        if (index >= 0 && index < cartWheelchairs.length) {
          cartWheelchairIndex = index;
        }
        currentWheelchair.editingWheelchair = $.extend(true, cartWheelchairs[index]);
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
        while (localJSONStorage.get('wheelchair' + wIndex)){
          cartWheelchairs.push(new Wheelchair(localJSONStorage.get('wheelchair' + wIndex)));
          wIndex ++;
        }

        //add current cart items to curOrder
        for (var j = 0; j < cartWheelchairs.length; j++) {
          curOrder.wheelchairs.push(cartWheelchairs[j]);
        }

        if (curOrder.wheelchairs.length > 0) {
          orders.push(curOrder);
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

          currentWheelchair = data.currentWheelchair || currentWheelchair;
          currentWheelchair.editingWheelchair = currentWheelchair.editingWheelchair ? new Wheelchair(currentWheelchair.editingWheelchair) : currentWheelchair.editingWheelchair;
          currentWheelchair.design = currentWheelchair.design ? new Design(currentWheelchair.design) : null;

          cartWheelchairs = data.cartWheelchairs ? data.cartWheelchairs.map(function (wheelchair) {
            return new Wheelchair(wheelchair);
          }) : cartWheelchairs;
          isAdmin = data.isAdmin || false;

          //add current cart items to curOrder
          for (var j = 0; j < cartWheelchairs.length; j++) {
            curOrder.wheelchairs.push(cartWheelchairs[j]);
          }

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

      // Make a request to /session. If it succeeds, restore user from response, otherwise, restore from settings
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
          .then(function (designObj) {
            return new Design(designObj.data);
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

          return $http({
            url: '/design/' + design.id,
            data: design.allDetails(),
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
            console.log('Request Failed: ' + err);
          });
        },

        logout: function () {
          init(); //restore user variables to intial value

          // If there is a current order the user is working on, dont lose it
          var curOrder = this.getCurEditOrder();
          orders = [];
          if (curOrder) {
            orders.push(curOrder);
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
          console.log('wheelchair'+cartWheelchairs.length);

          if (this.isLoggedIn()) {
            return this.updateDB();
          } else {
            // sync in memory cart with cookie storage
            localJSONStorage.remove('wheelchair'+cartWheelchairs.length);
            for (var i = 0; i < cartWheelchairs.length; i++) {
              localJSONStorage.put('wheelchair' + i, cartWheelchairs[i].getAll());
            }
          }
        },


        /*************************MY DESIGNS*******************************/

        createCurrentDesign: createCurrentDesign,

        //Create a new wheelchair object of given frame type and set edit pointer to it
        pushNewWheelchair: function () {
          if (currentWheelchair.isNew === true ) {
            cartWheelchairs.push(currentWheelchair.editingWheelchair);
            cartWheelchairIndex = cartWheelchairs.length - 1;
          }
          else if (currentWheelchair.isNew === false) {
            cartWheelchairs[cartWheelchairIndex] = $.extend(true, currentWheelchair.editingWheelchair);
            var order = this.getCurEditOrder();
            if(order && currentWheelchair.orderInd >= 0) {
              order.wheelchairs[currentWheelchair.orderInd] = cartWheelchairs[cartWheelchairIndex];
            }
          }
          this.updateCart();
        },

        //Set the given wheelchair index to be edited
        setEditWheelchair: setEditWheelchair,

        // Saves the currentWheelchair into the saved wheelchairs list and resets the currentWheelchair
        addDesignIDToSavedChairs: function (designID) {
          savedChairs.push(designID);
          this.updateDB();
        },

        //Removes the wheelchair at the given index from the user's myDesign
        deleteWheelchair: function (index) {
          cartWheelchairs.splice(index, 1);
          this.updateCart();
        },

        //Returns the full array of user-defined wheelchairs
        getCartWheelchairs: function () {
          return cartWheelchairs;
        },

        getWheelchair: function (index) {
          if (index >= 0 && index < cartWheelchairs.length)
            return cartWheelchairs[index];
          return null;
        },

        // returns full array of users wishlist/my design wheelchairs
        getSavedChairs: function () {
          return savedChairs;
        },

        getSavedChair: function (index) {
          if (index >= 0 && index < savedChairs.length) {
            return savedChairs[index];
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
          return cartWheelchairs.length;
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
            var newOrder = new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, null);
            orders.push(newOrder);
          }
        },

        //Returns the unsent Order set as the "curEditOrder"
        //If no such Order exists, returns null
        getCurEditOrder: function () {
          if (!curOrder.hasBeenSent()) {
            var lastOrder = orders[orders.length - 1];
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



