const request = require('supertest');
const Chance = require('chance');

const getLoggedInAgent = require('../../helpers/getLoggedInAgent');
const dbService = require('../../../../server_scripts/services/db');
const promise = require('bluebird');
const getUserPr = promise.promisify(dbService.findDB);
const getOrdersPr = promise.promisify(dbService.findDB);
const chance = new Chance();

before(done => {
  if (typeof app === 'undefined') {
    done(new Error('Something went wrong in bootstrapping'));
  } else {
    done();
  }
});

describe('Test user updates', () => {
  var agent = null;
  var user = null;

  before(function (done) {

    getLoggedInAgent.newUser(app)
      .then(result => {
        agent = result.agent;
        user = result.user;
        user.cart = {};
        done();
      })
      .catch(done);
  });

  it('Should update wheelchair', done => {
    var wheelchair = {
      'currentWheelchair': {
        'new': 'true'
      }
    };
    agent
      .post('/users/current/current-wheelchair')
      .send(wheelchair)
      .then(() => {
        getUserPr('users',user._id).then(function (resp) {
          user._rev = resp._rev;
          resp.should.have.property('currentWheelchair');
          _.isEqual(resp.currentWheelchair, wheelchair.currentWheelchair).should.equal(true);
          done();
        })
      })
      .expect(200);
  });

  it('Should not be able to update wheelchair if user is not logged in', done => {
    request(app)
      .post('/users/current/current-wheelchair')
      .expect(res => {
        res.should.have.property('body');
        res.body.should.have.property('userID');
        res.body.userID.should.equal(-1);
      })
      .expect(200, done);
  });

  it('Should update saved designs', done => {
    var testDesigns = {
      'savedDesigns': [{
        'testDesign': true
      }]
    };

    agent
      .post('/users/current/designs')
      .send(testDesigns)
      .then(() => {
        getUserPr('users',user._id).then(function (resp) {
          user._rev = resp._rev;
          resp.should.have.property('savedDesigns');
          _.isEqual(resp.savedDesigns, testDesigns.savedDesigns).should.equal(true);
          done();
        })
      })
      .expect(200);
  });

  it('Should not be able to update saved designs if user is not logged in', done => {
    request(app)
      .post('/users/current/designs')
      .expect(res => {
        res.should.have.property('body');
        res.body.should.have.property('userID');
        res.body.userID.should.equal(-1);
      })
      .expect(200, done);
  });

  it('Should update cart', done => {
    let expectedCartObj = {
      "cart": { 'orderNum': 'OrderNumNotSet',
        'taxRate': 0,
        'shippingFee': 15,
        'sentDate': null,
        'userID': 'testUserId',
        'email': '',
        'phone': '',
        'shippingDetails': 
         { 'fName': '',
           'lName': '',
           'addr': '',
           'addr2': '',
           'city': '',
           'state': '',
           'zip': '' },
        'billingDetails': 
         { 'fName': '',
           'lName': '',
           'addr': '',
           'addr2': '',
           'city': '',
           'state': '',
           'zip': '' },
        'payMethod': 'Credit Card',
        'userType': 'User',
        'poNumber': '',
        'wheelchairs': 
         [ { 'creator': 'prozrachniy@gmail.com',
             'createdAt': '2016-08-04T13:13:13.029Z',
             'updatedAt': '2016-08-04T13:13:13.029Z',
             'wheelchair': [
             { 'frameID': 21,
              'title': 'My Custom Wheelchair',
              'parts': [ 'parts' ],
              'measures': [ 'measures' ],
              'inCurOrder': false,
              'grantAmount': 0 }] } ],
        'discounts': [] }
    }

    agent
      .post('/users/current/cart')
      .send(expectedCartObj)
      .then((response) => {
        let cartId = response.body._id;
        getUserPr('users',user._id).then(function (resp) {
          user._rev = resp._rev;
          user.cart._rev = response.body.rev;
          user.cart._id = cartId
          resp.should.have.property('cart');
          resp.cart.should.equal(cartId);
          getOrdersPr('orders',cartId).then(function(resp) {
            resp.userID.should.equal('testUserId');
            done();
          });
        })
      })
      .expect(200);
  });

  it('Should not be able to update cart if user is not logged in', done => {
    request(app)
      .post('/users/current/cart')
      .expect(res => {
        res.should.have.property('body');
        res.body.should.have.property('userID');
        res.body.userID.should.equal(-1);
      })
      .expect(200, done);
  });

  it('Should update user information', done => {
    user.fName = 'differentName';
    agent
      .post('/users/current/info')
      .send(user)
      .then(() => {
        getUserPr('users',user._id).then(function (resp) {
          user._rev = resp._rev;
          resp.fName.should.equal('differentName');
          done();
        })
      })
      .expect(200);
  });

  it('Should validate new password', done => {
    user.newPass1 = '5char';
    agent
      .post('/users/current/info')
      .send(user)
      .then((res) => {
        res.body.message.should.equal('New password is not valid');
        getUserPr('users',user._id).then(function (resp) {
          user._rev = resp._rev;
          done();
        })
      })
      .expect(200);
  });

  it('Should not be able to update user info if user is not logged in', done => {
    request(app)
      .post('/users/current/info')
      .expect(res => {
        res.should.have.property('body');
        res.body.should.have.property('userID');
        res.body.userID.should.equal(-1);
      })
      .expect(200, done);
  });

  after(done => {
    var cleanupUser = cb => {
      dbService.deleteFromDBfunction('users', user._id, user._rev, cb)
      // dbService.users.deleteDoc(user._id, user._rev, cb);
    };

    var cleanupOrders = cb => {
      dbService.deleteFromDBfunction('orders', user.cart._id, user.cart._rev, cb)
      // dbService.orders.deleteDoc(user.cart._id, user.cart._rev, cb);
    };

    async.parallel([cleanupOrders, cleanupUser], done);
  });
});
