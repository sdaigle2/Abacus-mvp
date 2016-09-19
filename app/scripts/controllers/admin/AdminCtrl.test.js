describe('AdminController', function() {
  beforeEach(module('abacuApp'));

  var $controller, AdminApiMock;

  beforeEach(function () {
    function getUserType() {
        return 'admin';
    }
    module(function ($provide) {
      $provide.value('User', {getUserType: getUserType});
    });
  });

  beforeEach(inject(function(_$controller_, $q, $httpBackend){
    $controller = _$controller_;
    httpBackend = $httpBackend;
  }));

  

  it('should validate percent', function() {
    var $scope = {};
    
    var controller = $controller('AdminCtrl', { $scope: $scope});
    $scope.discount = {
      id: 'test',
      percent: 'invalid',
      startDate: '2016-06-31T21:00:00.000Z',
      endDate: '2016-09-31T21:00:00.000Z'
    };
    $scope.submitDiscount();
    expect($scope.errorMsg).toEqual('Percent should be a number.');
  });

  it('should validate id', function() {
    var $scope = {};
    
    var controller = $controller('AdminCtrl', { $scope: $scope });
    $scope.discount = {
      id: null,
      percent: 12,
      startDate: '2016-06-31T21:00:00.000Z',
      endDate: '2016-09-31T21:00:00.000Z'
    };
    $scope.submitDiscount();
    expect($scope.errorMsg).toEqual('Please fill in all the fields.');
  });

  it('should throw an error if user type is not superAdmin and percent is > 25%', function() {
    var $scope = {};
    var controller = $controller('AdminCtrl', { $scope: $scope, httpBackend: httpBackend});
    $scope.discount = {
      id: 'valid',
      percent: '26',
      startDate: '2016-06-31T21:00:00.000Z',
      endDate: '2016-09-31T21:00:00.000Z'
    };

    $scope.submitDiscount()
    expect($scope.errorMsg).toEqual('As an admin, you may only create discount codes no greater than 25%. Please contact Chris, Danny, or Cesar for approval to create a larger discount.');
  });

  it('should successfully create a discount if data is correct', function() {
    var $scope = {};
    var controller = $controller('AdminCtrl', { $scope: $scope, httpBackend: httpBackend});
    $scope.discount = {
      id: 'valid',
      percent: '12',
      startDate: '2016-06-31T21:00:00.000Z',
      endDate: '2016-09-31T21:00:00.000Z'
    };
    httpBackend.expectPOST('discounts', {"id":"valid","percent":0.12,"startDate":"2016-06-31T21:00:00.000Z","endDate":"2016-09-31T21:00:00.000Z"})
    .respond(200, {});
    $scope.submitDiscount()
    httpBackend.flush();

    expect($scope.successMsg).toEqual('Discount successfully created.');

  });
});