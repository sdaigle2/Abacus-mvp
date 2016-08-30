describe('AdminController', function() {
  beforeEach(module('abacuApp'));

  var $controller, AdminApiMock;

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

  it('should successfully create a discount if data is correct', function() {
    var $scope = {};
    var controller = $controller('AdminCtrl', { $scope: $scope, httpBackend: httpBackend});
    $scope.discount = {
      id: 'valid',
      percent: '12',
      startDate: '2016-06-31T21:00:00.000Z',
      endDate: '2016-09-31T21:00:00.000Z'
    };
    httpBackend.expectGET('users/current')
    .respond(200, {});
    httpBackend.expectPOST('discounts', {"id":"valid","percent":0.12,"startDate":"2016-06-31T21:00:00.000Z","endDate":"2016-09-31T21:00:00.000Z"})
    .respond(200, {});
    $scope.submitDiscount()
    httpBackend.flush();

    expect($scope.successMsg).toEqual('Discount successfully created.');

  });
});