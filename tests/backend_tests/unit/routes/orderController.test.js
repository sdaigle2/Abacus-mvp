const request = require('supertest');
const Chance = require('chance');
const sinon = require('sinon');

const getLoggedInAgent = require('../../helpers/getLoggedInAgent');
const dbService = require('../../../../server_scripts/services/db');
const promise = require('bluebird');
const getUserPr = promise.promisify(dbService.findDB);
const getOrdersPr = promise.promisify(dbService.findDB);
const insertUserPr = promise.promisify(dbService.insertDB);
const chance = new Chance();
const orderController = require('../../../../server_scripts/routes/orderController');


let mockFn = {
  sendReceipt: function() {
    return;
  }
}
orderController.mockSendgrid(mockFn);
let spy = sinon.spy(mockFn, "sendReceipt");

before(done => {
  if (typeof app === 'undefined') {
    done(new Error('Something went wrong in bootstrapping'));
  } else {
    done();
  }
});

let newOrder = {
  "taxRate": 0,
  "shippingFee": 15,
  "sentDate": "2016-09-13T08:16:31.091Z",
  "userID": "test",
  "email": "test@gmail.com",
  "phone": "2132141323",
  "shippingDetails": {},
  "billingDetails": {},
  "payMethod": "Pay part now",
  "payType": "Credit Card",
  "userType": "User",
  "poNumber": "test",
  "wheelchairs": [
  ],
  "discounts": [],
  "totalDue": 3000,
  "totalDueLater": 1500,
  "orderStatus": "Thankyou for the downpayment, we’ll start building your wheelchair now. Please note that you will need to pay the remainder before the order ships.",
  "paymentStatus": "At least 50% paid",
  "payments": [
    {
      "date": "2016-09-13T08:16:32.776Z",
      "method": "Credit Card",
      "amount": 1500,
      "checkNumber": "",
      "ccNum": "4242424242424242",
      "stripeId": "tok_18tC5gINwjxIyUCVNj2wmdg7",
      "memo": "initial payment"
    }
  ],
  "orderNum": 9999
}
let orderId, orderRev;
describe('Test order payments', () => {
  before(done => {
    getLoggedInAgent.newUser(app)
      .then(result => {
        agent = result.agent;
        user = result.user;
        user.cart = {};
        done();
      })
      .catch(done);
  });
  before(done => {
    dbService.insertDBfunction('orders',newOrder, (err, resp) => {
      orderId = resp.id;
      orderRev = resp.rev;
      newOrder._id = orderId;
      done();
    });
  });

  it('Should add payment', done => {
    request(app)
      .post('/orders/create-payment')
      .send({
        paymentAmount: 100,
        payType: 'Cash',
        token: '', 
        order: newOrder, 
        creditCard: '', 
        checkNum: '',
        memo: 'test memo'
      })
      .then((resp) => {
        orderRev = resp.body.rev;
        getOrdersPr('orders',newOrder._id).then(function (resp) {
          resp.payments.length.should.equal(2);
          resp.payMethod.should.equal('Pay part now');
          resp.payments[1].amount.should.equal(100);
          resp.payments[1].method.should.equal('Cash');
          resp.payments[1].method.should.equal('Cash');
          done();
        });
      })
      .expect(200);
  });

  it('Should set status 50% paid', done => {
    request(app)
      .post('/orders/create-payment')
      .send({
        paymentAmount: 100,
        payType: 'Cash',
        token: '', 
        order: newOrder, 
        creditCard: '', 
        checkNum: '',
        memo: 'test memo'
      })
      .then((resp) => {
        orderRev = resp.body.rev;
        getOrdersPr('orders',newOrder._id).then(function (resp) {

          resp.paymentStatus.should.equal('At least 50% paid');
          done();
        });
      })
      .expect(200);
  });

  it('Should generate sendgrid requests correctly', done => {
    request(app)
      .post('/orders/create-payment')
      .send({
        paymentAmount: 100,
        payType: 'Cash',
        token: '', 
        order: newOrder, 
        creditCard: '', 
        checkNum: '',
        memo: 'test memo'
      })
      .then((resp) => {
        orderRev = resp.body.rev;
        let expectedSubs = {
          '-amountPaid-': '100.00',
          '-balanceDue-': '1400.00',
          '-orderNumber-': '9999',
          '-orderStatus-': 'Thankyou for the downpayment, we’ll start building your wheelchair now. Please note that you will need to pay the remainder before the order ships.',
          '-paymentStatus-': 'At least 50% paid',
          '-previousPayments-': '1500.00',
          '-totalDue-': '3000.00'
        };
        getOrdersPr('orders',newOrder._id).then(function (resp) {
          spy.args[0][0].should.equal('do-not-reply@per4max.fit');

          _.isEqual(spy.args[0][3], expectedSubs).should.equal(true);
          done();
        });
      })
      .expect(200);
  });

  it('Should set status paid in full', done => {
    request(app)
      .post('/orders/create-payment')
      .send({
        paymentAmount: 1200,
        payType: 'Cash',
        token: '', 
        order: newOrder, 
        creditCard: '', 
        checkNum: '',
        memo: 'test memo'
      })
      .then((resp) => {
        orderRev = resp.body.rev;
        getOrdersPr('orders',newOrder._id).then(function (resp) {
          resp.paymentStatus.should.equal('Paid in full');
          done();
        });
      })
      .expect(200);
  });

  it('Should fail to edit order if user is not admin', done => {
    newOrder.orderStatus = 'new test status';
    agent
      .put(`/orders/${orderId}`)
      .send(newOrder)
      .expect(res => {
        res.body.msg.should.equal('Only admin users are authorized to perform this operation.')
      })
      .expect(401, done);
  });

  it('Should edit order if user is admin', done => {
    getUserPr('users',user._id)
    .then(userFromDb => {
      userFromDb.userType = 'admin';
      insertUserPr('users',userFromDb)
      .then(function(resp) {
        newOrder.orderStatus = 'new test status';
        newOrder._rev = orderRev;
        agent
          .put(`/orders/${orderId}`)
          .send({order: newOrder})
          .then(res => {
            orderRev = res.body.rev;
            getOrdersPr('orders',newOrder._id).then(function (resp) {
              resp.orderStatus.should.equal('new test status');
              done();
            });
          })
          .expect(200);
      })
    })
  });

  after(done => {
    var cleanupOrders = cb => {
      dbService.orders.deleteDoc(orderId, orderRev, cb);
    };

    async.parallel([cleanupOrders], done);
  });
});
