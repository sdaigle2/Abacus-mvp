'use strict';
var Stripe = {
  setPublishableKey : function() {
    return;
  },
  card: {
    createToken : function(arg1, arg2) {
      arg2('200', {id: 'testId'})
    }
  }
}

describe('Payments controller', function() {
  beforeEach(module('abacuApp'));

  var $controller;
  var expectedRequesData = {"paymentAmount":1494,"payType":"Credit Card","token":"testId","order":{"_id":"6e5853b81f3a5241701077e8bb2eca3e","_rev":"4-996c06db5eb9370e7e27b3868adba5bf","taxRate":0,"shippingFee":15,"sentDate":"2016-09-14T15:05:38.233Z","userID":"martyrosian.david@gmail.com","email":"martyrosian.david@gmail.com","phone":"2132141323","shippingDetails":{"fName":"David","lName":"Dasdasda","addr":"www","addr2":"","city":"wwww","state":"OR","zip":"123"},"billingDetails":{"fName":"David","lName":"Dasdasda","addr":"www","addr2":"","city":"wwww","state":"OR","zip":"123"},"payMethod":"Pay part now","payType":"Credit Card","userType":"User","poNumber":"tet","wheelchairs":[{"creator":"martyrosian.david@gmail.com","createdAt":"2016-09-14T15:04:59.991Z","updatedAt":"2016-09-14T15:04:59.991Z","wheelchair":{"frameID":21,"title":"My Custom Wheelchair","parts":[],"measures":[],"inCurOrder":false,"grantAmount":0,"userInfo":{"wheelchairName":"Thunder -Basketball"}},"_id":"BkdmDyD2","_rev":"3-d0172f8ebd6e8a6c337a3424c159e7a1","rev":"3-d0172f8ebd6e8a6c337a3424c159e7a1"}],"discounts":[],"totalDue":2989,"totalDueLater":1494,"orderStatus":"Thankyou for the downpayment, we’ll start building your wheelchair now. Please note that you will need to pay the remainder before the order ships.","paymentStatus":"At least 50% paid","payments":[{"date":"2016-09-14T15:05:40.103Z","method":"Credit Card","amount":1494.5,"checkNumber":"","ccNum":"4242","stripeId":"tok_18tex9INwjxIyUCVvavwxX9z","memo":"initial payment"}],"id":"6e5853b81f3a5241701077e8bb2eca3e","orderNum":2605,"totalDueNow":1494},"creditCard":{"number":"4242424242424242"}};

  beforeEach(function () {
    function getSentOrders() {
        return [{
          "_id": "6e5853b81f3a5241701077e8bb2eca3e",
          "_rev": "4-996c06db5eb9370e7e27b3868adba5bf",
          "taxRate": 0,
          "shippingFee": 15,
          "sentDate": "2016-09-14T15:05:38.233Z",
          "userID": "martyrosian.david@gmail.com",
          "email": "martyrosian.david@gmail.com",
          "phone": "2132141323",
          "shippingDetails": {
            "fName": "David",
            "lName": "Dasdasda",
            "addr": "www",
            "addr2": "",
            "city": "wwww",
            "state": "OR",
            "zip": "123"
          },
          "billingDetails": {
            "fName": "David",
            "lName": "Dasdasda",
            "addr": "www",
            "addr2": "",
            "city": "wwww",
            "state": "OR",
            "zip": "123"
          },
          "payMethod": "Pay part now",
          "payType": "Credit Card",
          "userType": "User",
          "poNumber": "tet",
          "wheelchairs": [
            {
              "creator": "martyrosian.david@gmail.com",
              "createdAt": "2016-09-14T15:04:59.991Z",
              "updatedAt": "2016-09-14T15:04:59.991Z",
              "wheelchair": {
                "frameID": 21,
                "title": "My Custom Wheelchair",
                "parts": [
                ],
                "measures": [
                ],
                "inCurOrder": false,
                "grantAmount": 0,
                "userInfo": {
                  "wheelchairName": "Thunder -Basketball"
                }
              },
              "_id": "BkdmDyD2",
              "_rev": "3-d0172f8ebd6e8a6c337a3424c159e7a1",
              "rev": "3-d0172f8ebd6e8a6c337a3424c159e7a1"
            }
          ],
          "discounts": [],
          "totalDue": 2989,
          "totalDueLater": 1494,
          "orderStatus": "Thankyou for the downpayment, we’ll start building your wheelchair now. Please note that you will need to pay the remainder before the order ships.",
          "paymentStatus": "At least 50% paid",
          "payments": [
            {
              "date": "2016-09-14T15:05:40.103Z",
              "method": "Credit Card",
              "amount": 1494.5,
              "checkNumber": "",
              "ccNum": "4242",
              "stripeId": "tok_18tex9INwjxIyUCVvavwxX9z",
              "memo": "initial payment"
            }
          ],
          "id": "6e5853b81f3a5241701077e8bb2eca3e",
          "orderNum": 2605
        }]
    }
    module(function ($provide) {
      $provide.value('User', {getSentOrders: getSentOrders});
    });
  });

  beforeEach(inject(function(_$controller_, $httpBackend){
    $controller = _$controller_;
    httpBackend = $httpBackend;
  }));

  
  describe('Payments', function() {
    it('Should set stripe token if payment is credit card', function() {
      var $scope = {
        '$watch' : function() {
          return
        }
      };
      var controller = $controller('PaymentCtrl', { $scope: $scope , $routeParams: {orderNum: 2605}});
      controller.userCard = {
        number: '4242424242424242'
      };
      controller.makePayment();
      httpBackend.expectPOST('orders/create-payment', expectedRequesData)
      .respond(200, {});
      httpBackend.flush();
      expect(controller.token).toEqual('testId');
      expect(controller.dropdownOpen).toEqual(true);

    });

    it('Should leave stripe token undefined payment is cash', function() {
      var $scope = {
        '$watch' : function() {
          return
        }
      };
      var controller = $controller('PaymentCtrl', { $scope: $scope , $routeParams: {orderNum: 2605}});
      controller.paymentOrder.payType = 'Cash';
      controller.makePayment();
      httpBackend.expectPOST('orders/create-payment')
      .respond(200, {});
      httpBackend.flush();
      expect(controller.token).toEqual(undefined);
      expect(controller.dropdownOpen).toEqual(true);
    });
  });
});
