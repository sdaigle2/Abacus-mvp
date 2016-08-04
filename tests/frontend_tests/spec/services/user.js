'use strict';

describe('Tests main userService functions exposed to controllers', function () {
  var User, httpBackend, 
  expectedCartObj = {
    "cart": {
      "orderNum":"OrderNumNotSet",
      "taxRate":0,
      "shippingFee":15,
      "sentDate":null,
      "userID":-1,
      "email":"",
      "phone":"",
      "id": "testId",
      "shippingDetails":{"fName":"","lName":"","addr":"","addr2":"","city":"","state":"","zip":""},
      "billingDetails":{"fName":"","lName":"","addr":"","addr2":"","city":"","state":"","zip":""},
      "payMethod":"Credit Card",
      "userType":"User",
      "poNumber":"",
      "wheelchairs":[{
        "_id": "testWheelchairId"
      }],
      "discounts":[],
      getAll: function() {
        return User.getCart()
      }
    }
  };

  beforeEach(module('abacuApp'));

  beforeEach(function () {
    function mockWheelchair(frame) {
        this.frame = frame;
    }
    module(function ($provide) {
      $provide.value('Wheelchair', mockWheelchair);
    });
  });

  beforeEach(inject(function ($httpBackend, _User_) {
    User = _User_;
    httpBackend = $httpBackend;
  }));

  it('should check if createCurrentDesign does create a wheelchair in user object', function () {
    var expectedWheelchairObj = {
      'currentWheelchair': {
        'design': {
          '_id': 'testId'
        }
      }
    };
    User.setUser();
    var currentWheelChair = User.getCurrentWheelchair();
    httpBackend.expectPOST('/update-current-wheelchair', currentWheelChair)
    .respond(200, expectedWheelchairObj);
    httpBackend.whenPOST('/session', '').respond(200, '');
    User.createCurrentDesign(1);
    httpBackend.flush();
    var wheelchairFromRestore = User.getCurrentWheelchair();
    expect(wheelchairFromRestore.currentWheelchair.design._id).toBe('testId');
  });

  it('should set edit wheelchair', function () {
    var expectedWheelchairObj = {
      'currentWheelchair': {
        'design': {
          '_id': 'testId'
        }
      }
    };
    var mockCart = {
      'wheelchairs': [{
        '_rev': 'mockRev'
      }]
    }
    User.setUser();
    User.setCart(mockCart);
    var currentWheelChair = User.getCurrentWheelchair();
    httpBackend.expectPOST('/update-current-wheelchair', currentWheelChair)
    .respond(200, expectedWheelchairObj);
    httpBackend.whenPOST('/session', '').respond(200, '');
    User.setEditWheelchair(0, expectedWheelchairObj)
    httpBackend.flush();
    var wheelchairFromRestore = User.getCurrentWheelchair();
    expect(wheelchairFromRestore.currentWheelchair.design._id).toBe('testId');
  });

  it('should set wheelchair from existing designs', function () {
    var expectedWheelchairObj = {
      'currentWheelchair': {
        'design': {
          '_id': 'testId'
        }
      }
    };
    var mockDesigns = [{
      '_rev': 'mockRev'
    }]
    User.setUser();
    User.setDesign(mockDesigns);
    var currentWheelChair = User.getCurrentWheelchair();
    httpBackend.expectPOST('/update-current-wheelchair', currentWheelChair)
    .respond(200, expectedWheelchairObj);
    httpBackend.whenPOST('/session', '').respond(200, '');
    User.setEditWheelchairFromMyDesign(0)
    httpBackend.flush();
    var wheelchairFromRestore = User.getCurrentWheelchair();
    expect(wheelchairFromRestore.currentWheelchair.design._id).toBe('testId');
  });

  it('should add design to saved designs', function () {
    var expectedSavedDesignsObj = {
      'savedDesigns': ['testDesign']
    };
    User.setUser();
    httpBackend.expectPOST('/update-saved-designs', expectedSavedDesignsObj)
    .respond(200, expectedSavedDesignsObj);
    httpBackend.whenPOST('/session', '').respond(200, '');
    User.addDesignIDToSavedDesigns(expectedSavedDesignsObj.savedDesigns[0])
    httpBackend.flush();
    var savedDesignsFromRestore = User.getSavedDesigns();
    expect(savedDesignsFromRestore[0]).toBe('testDesign');
  });

  it('should remove design from saved designs', function () {
    var expectedSavedDesignsObj = {
      'savedDesigns': ['testId']
    };
    User.setUser();
    User.setDesign(['testId']);
    httpBackend.expectPOST('/update-saved-designs', expectedSavedDesignsObj)
    .respond(200, []);
    httpBackend.whenPOST('/session', '').respond(200, '');
    User.removeDesignFromSavedDesigns('testId')
    httpBackend.flush();
    var savedDesignsFromRestore = User.getSavedDesigns();
    expect(savedDesignsFromRestore.length).toBe(0);
  });

  it('should push a new wheelchair to cart', function () {
    User.setUser();
    User.setCart(expectedCartObj.cart)
    User.setCurrentWheelchair({
      'design': {}
    })
    httpBackend.expectPOST('/update-cart', expectedCartObj)
    .respond(200, expectedCartObj);
    httpBackend.whenPOST('/session', '').respond(200, '');
    
    User.pushNewWheelchair('testWheelchair');
    User.setCart(null); // intentionally setting cart to null to check if it updates on response from server
    httpBackend.flush();
    expect(User.getCart().wheelchairs[0]._id).toBe('testWheelchairId');
    expect(User.getCart()._id).toBe('testId');
  });

  it('should removed a wheelchair from cart', function () {
    User.setUser();
    User.setCart(expectedCartObj.cart)
    User.setCurrentWheelchair({
      'design': {}
    })
    httpBackend.expectPOST('/update-cart', expectedCartObj)
    .respond(200, expectedCartObj);
    httpBackend.whenPOST('/session', '').respond(200, '');
    
    User.deleteWheelchair(0);
    httpBackend.flush();
    expect(User.getCart().wheelchairs.length).toBe(0);
  });
});