var Stripe = {
  setPublishableKey: function() {return},
  card: {
    createToken: function(arg1, cb) {
      cb(null, {})
    }
  }
}
describe('OrdersController', function() {
  beforeEach(module('abacuApp'));

  var $controller;

  beforeEach(function () {
    function getUserType() {
        return 'admin';
    }
    module(function ($provide) {
      $provide.value('User', {getUserType: getUserType});
    });
  });

  beforeEach(inject(function(_$controller_, $httpBackend){
    $controller = _$controller_;
    httpBackend = $httpBackend;
  }));

  it('Should get the order by id if no order is available through OrderApi service', function() {
    var $scope = {
      '$watch': function() {return;}
    };
    
    var controller = $controller('OrdersController', { $scope: $scope, $routeParams: {orderId: 'testId'}});
    httpBackend.expectGET('orders/testId')
    .respond(200, {_id: "6cfe700e391f3eeaa367a22a66369b7b", _rev: "14-d07e0eae1a518c9a97c208db3eb23e77", taxRate: 0, shippingFee: 15, sentDate: "2016-09-25T21:00:00.000Z"});
  });

  it('Should set a new status', function() {
    var $scope = {
      '$watch': function() {return;}
    };
    
    var controller = $controller('OrdersController', { $scope: $scope, $routeParams: {orderId: 'testId'}});
    httpBackend.expectGET('orders/testId')
    .respond(200, {_id: "6cfe700e391f3eeaa367a22a66369b7b", _rev: "14-d07e0eae1a518c9a97c208db3eb23e77", taxRate: 0, shippingFee: 15, sentDate: "2016-09-25T21:00:00.000Z"});
    controller.newOrderStatus = 'New status for testing';
    controller.saveStatus();
    expect(controller.orderToEdit.orderStatus).toEqual('New status for testing');
  });

  it('Should fail to save a payment if amount to pay is not valid', function() {
    var $scope = {
      '$watch': function() {return;}
    };
    
    var controller = $controller('OrdersController', { $scope: $scope, $routeParams: {orderId: 'testId'}});
    httpBackend.expectGET('orders/testId')
    .respond(200, {_id: "6cfe700e391f3eeaa367a22a66369b7b", _rev: "14-d07e0eae1a518c9a97c208db3eb23e77", taxRate: 0, shippingFee: 15, sentDate: "2016-09-25T21:00:00.000Z"});
    controller.payment.amountPaid = -500;
    controller.payment.payType = 'Credit Card';
    controller.payment.card = {
      'number': 4242424242424242
    };
    controller.savePayment();
    expect(controller.errorMsg).toEqual('Please enter a value between 0 and undefined');
  });


  it('Should fail to save a payment if payType is credit card and number is incorrect', function() {
    var $scope = {
      '$watch': function() {return;}
    };
    
    var controller = $controller('OrdersController', { $scope: $scope, $routeParams: {orderId: 'testId'}});
    httpBackend.expectGET('orders/testId')
    .respond(200, {_id: "6cfe700e391f3eeaa367a22a66369b7b", _rev: "14-d07e0eae1a518c9a97c208db3eb23e77", taxRate: 0, shippingFee: 15, sentDate: "2016-09-25T21:00:00.000Z"});
    controller.payment.amountPaid = 200;
    controller.payment.payType = 'Credit Card';
    controller.payment.card = {
      'number': 'invalid'
    };
    controller.savePayment();

    expect(controller.errorMsg).toEqual('Credit card number is not correct');
  });


  it('Should save a payment', function() {
    var $scope = {
      '$watch': function() {return;}
    };
    
    var controller = $controller('OrdersController', { $scope: $scope, $routeParams: {orderId: 'testId'}});
    httpBackend.expectGET('orders/testId')
    .respond(200, {_id: "6cfe700e391f3eeaa367a22a66369b7b", _rev: "14-d07e0eae1a518c9a97c208db3eb23e77", taxRate: 0, shippingFee: 15, sentDate: "2016-09-25T21:00:00.000Z"});
    controller.payment.amountPaid = 200;

    controller.orderToEdit.payments = [];
    controller.orderToEdit.totalDueLater = 1000;
    controller.orderToEdit.totalDue = 3000;
    controller.payment.payType = 'Credit Card';
    controller.payment.card = {
      'number': '4242424242424242',
      'cvc': '123',
      'card.exp_month': '12',
      'card.exp_year': '18'
    };
    controller.savePayment();
    expect(controller.errorMsg).toEqual('');
    expect(controller.orderToEdit.payments[0].amount).toEqual(200);
    expect(controller.orderToEdit.payments[0].method).toEqual('Credit Card');
    expect(controller.orderToEdit.payments[0].ccNum).toEqual('4242');
  });
});
