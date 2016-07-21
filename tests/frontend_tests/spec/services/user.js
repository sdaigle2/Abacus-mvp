'use strict';

describe('Tests main userService functions exposed to controllers', function () {
  var User, httpBackend;

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

});