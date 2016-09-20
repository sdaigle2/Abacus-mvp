describe('AdminController', function() {
  beforeEach(module('abacuApp'));

  var $controller, DiscountsAPI;

  beforeEach(function () {
    function getUserType() {
        return 'admin';
    }
    module(function ($provide) {
      $provide.value('User', {getUserType: getUserType});
    });
  });

  beforeEach(inject(function(_$controller_, $httpBackend, _DiscountsAPI_){
    $controller = _$controller_;
    httpBackend = $httpBackend;
    DiscountsAPI = _DiscountsAPI_;
    httpBackend.expectGET('orders').respond(200);
  }));

  describe('Discounts', function() {
    var discountsArr = {
      "rows": [{ 
        "doc": {
          "_id": "testdiscount",
          "_rev": "5-601cfb8a7eabef0d873e52f200a91560",
          "isMultiDiscount": false,
          "id": "testdiscount",
          "percent": 0.1,
          "startDate": "2016-08-31T05:00:00.000Z",
          "endDate": "2016-11-21T13:00:09.970Z",
          "createdBy": "testMail@mail.com",
          "createdAt": "2016-08-30T13:00:09.970Z"
        },
        "id": "testdiscount",
        "key": "testdiscount"
      }, 
      { "doc": {
          "_id": "latestCreated",
          "_rev": "5-601cfb8a7eabef0d873e52f200a91560",
          "isMultiDiscount": false,
          "id": "latestCreated",
          "percent": 0.1,
          "startDate": "2016-08-31T05:00:00.000Z",
          "endDate": "2016-12-21T13:00:09.970Z",
          "createdBy": "testMail@mail.com",
          "createdAt": "2016-09-30T13:00:09.970Z"
        },
        "id": "latestCreated",
        "key": "latestCreated"
      }, 
      { "doc": {
          "_id": "INVALID",
          "_rev": "5-601cfb8a7eabef0d873e52f200a91560",
          "isMultiDiscount": false,
          "id": "INVALID",
          "percent": 0.1,
          "startDate": "2016-08-31T05:00:00.000Z",
          "endDate": "2016-7-21T13:00:09.970Z", // expired endDate
          "createdBy": "testMail@mail.com"
        },
        "id": "INVALID",
        "key": "INVALID"
      }]
    };

    it('should sort out the expired discount', function() {
      var $scope = {};
      
      var controller = $controller('AdminCtrl', { $scope: $scope});
      controller.getContentSection = function() {return 'Discounts'};
      controller.init();
      httpBackend.expectGET('discounts')
      .respond(200, discountsArr);
      httpBackend.flush();
      expect(controller.discountsArray.length).toEqual(2);
    });

    it('should arrange the order of discounts by creation time', function() {
      var $scope = {};
      
      var controller = $controller('AdminCtrl', { $scope: $scope});
      controller.getContentSection = function() {return 'Discounts'};
      controller.init();
      httpBackend.expectGET('discounts')
      .respond(200, discountsArr);
      httpBackend.flush();
      expect(controller.discountsArray[0].doc.id).toEqual('latestCreated');
    });

    it('should delete "testdiscount" and keep "latestCreated"', function() {
      var $scope = {};
      
      var controller = $controller('AdminCtrl', { $scope: $scope});
      controller.getContentSection = function() {return 'Discounts'};
      controller.init();
      httpBackend.expectGET('discounts')
      .respond(200, discountsArr);
      httpBackend.expectPOST('discounts/expire')
      .respond(200, {});
      controller.deleteDiscount(discountsArr.rows[0]);
      httpBackend.flush();
      expect(controller.discountsArray[0].doc.id).toEqual('latestCreated');
    });

    it('should set a discount to edit', function() {
      var $scope = {};
      
      var controller = $controller('AdminCtrl', { $scope: $scope});
      controller.getContentSection = function() {return 'Discounts'};
      controller.init();
      httpBackend.expectGET('discounts')
      .respond(200, discountsArr);
      httpBackend.flush();
      controller.editDiscount({ 
        "doc": {
          "_id": "testdiscount",
          "_rev": "5-601cfb8a7eabef0d873e52f200a91560",
          "isMultiDiscount": false,
          "id": "testdiscount",
          "percent": 0.1,
          "startDate": "2016-08-31T05:00:00.000Z",
          "endDate": "2016-11-21T13:00:09.970Z",
          "createdBy": "testMail@mail.com",
          "createdAt": "2016-08-30T13:00:09.970Z"
        },
        "id": "testdiscount",
        "key": "testdiscount"
      });
      var discountToEdit = DiscountsAPI.getEditDiscount();
      expect(discountToEdit.id).toEqual('testdiscount');
    });
  })
  describe('Users', function() {
    var scope = {
      '$watch': function() {return;} // mocking watch function
    },
    usersArr = { total_rows: 3,
      offset: 0,
      rows: 
       [ { id: 'testUserId-1',
           doc: {
              "_id": "testUserId-1",
              "fName": "John",
              "lName": "Doe",
              "email": "test-1@mail.com",
              "phone": "0000",
              "addr": "test-1-addr",
              "addr2": "",
              "city": "test-1-city",
              "state": "ND",
              "zip": "111",
              "userType": "admin",
              "orders": [
                "3542e8ffc7a80234bcd444ce1c6ddda9"
              ],
              "savedDesigns": []
            } },
           { id: 'testUserId-2',
           doc: {
              "_id": "testUserId-2",
              "fName": "John",
              "lName": "Doe",
              "email": "test-2@mail.com",
              "phone": "0000",
              "addr": "test-2-addr",
              "addr2": "",
              "city": "test-2-city",
              "state": "ND",
              "zip": "111",
              "userType": "admin",
              "orders": [
                "3542e8ffc7a80234bcd444ce1c6ddda9"
              ],
              "savedDesigns": []
            } },
            { id: '_design/test',
           doc: {
              "_id": "_design/test"
            } }]
    }

    it('should list users and sort out design functions', function() {
      var $scope = scope;
      
      var controller = $controller('AdminCtrl', { $scope: $scope});
      controller.getContentSection = function() {return 'Users'};
      controller.init();
      httpBackend.expectGET('users')
      .respond(200, usersArr);
      httpBackend.flush();
      expect(controller.usersArray.length).toEqual(2);
    });

    it('should send a request to reset password if provided email is valid', function() {
      var $scope = scope;
      
      var controller = $controller('AdminCtrl', { $scope: $scope});
      controller.getContentSection = function() {return 'Users'};
      controller.resetPassword('testEmail@mail.com');
      httpBackend.expectPOST('users/email/testEmail@mail.com/request-reset-password')
      .respond(200, {});
      httpBackend.flush();
      expect(controller.resetSuccessMsg).toEqual('Reset link successfully sent');
    });

    it('should error out on attempt to reset password with no email', function() {
      var $scope = scope;
      
      var controller = $controller('AdminCtrl', { $scope: $scope});
      controller.getContentSection = function() {return 'Users'};
      controller.resetPassword();
      
      expect(controller.resetErrorMsg).toEqual('Error while resetting password');
    });

    it('should successfully change usertype', function() {
      var $scope = scope;
      
      var controller = $controller('AdminCtrl', { $scope: $scope});
      controller.getContentSection = function() {return 'Users'};
      controller.openProfile(usersArr.rows[0]);
      controller.profile.userType = 'basic';
      controller.filteredUsers = usersArr.rows;
      controller.setUserType();
      httpBackend.expectPOST('users/change-user-type')
      .respond(200);
      httpBackend.flush();
      expect(controller.filteredUsers[0].doc.userType).toEqual('basic');
    });
  })
  describe('Orders', function() {
    var scope = {
      '$watch': function() {return;}
    },
    ordersArr = { total_rows: 2,
      offset: 0,
      rows: 
       [ { id: 'testUserId-1',
           doc: {
              "_id": "testUserId-1",
              "sentDate": "2016-09-20T15:53:31.203Z",
              "userID": "test@gmail.com",
              "email": "test@gmail.com",
              "phone": "6303411942"
            } },
          { id: 'testUserId-2',
           doc: {
              "_id": "testUserId-2",
              "sentDate": "2016-12-20T15:53:31.203Z",
              "userID": "test@gmail.com",
              "email": "test@gmail.com",
              "phone": "6303411942"
            } }
        ]
    }

    it('should list orders by date', function() {
      var $scope = scope;
      
      var controller = $controller('AdminCtrl', { $scope: $scope});
      controller.getContentSection = function() {return 'Orders'};
      controller.init();
      httpBackend.expectGET('orders')
      .respond(200, ordersArr);
      httpBackend.flush();

      expect(controller.ordersArray.length).toEqual(2);
      expect(controller.ordersArray[0].id).toEqual('testUserId-2');
    });

    it('should add a formated date to each order', function() {
      var $scope = scope;
      
      var controller = $controller('AdminCtrl', { $scope: $scope});
      controller.getContentSection = function() {return 'Orders'};
      controller.init();
      httpBackend.expectGET('orders')
      .respond(200, ordersArr);
      httpBackend.flush();

      expect(controller.ordersArray[0].doc.date).toEqual('Dec 20, 2016');
      expect(controller.ordersArray[1].doc.date).toEqual('Sep 20, 2016');
    });
  })
});
