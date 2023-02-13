const request = require('supertest');
const Chance = require('chance');

const getLoggedInAgent = require('../../helpers/getLoggedInAgent');
const dbService = require('../../../../server_scripts/services/db');
const promise = require('bluebird');
const getUserPr = promise.promisify(dbService.findDB);
const getDiscountPr = promise.promisify(dbService.findDB);
const insertUserPr = promise.promisify(dbService.insertDB);

const chance = new Chance();

before(done => {
  if (typeof app === 'undefined') {
    done(new Error('Something went wrong in bootstrapping'));
  } else {
    done();
  }
});

describe('Test discounts', () => {
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

  var discount = {
    id: 'testdiscount',
    _id: 'testdiscount',
    percent: 11,
    startDate: '2016-06-31T21:00:00.000Z',
    endDate: '2017-12-31T21:00:00.000Z'
  };
  var discountRev = null;


  it('Should throw an error on attempt to create a discount if user is not admin', done => {
    agent
      .post('/discounts')
      .send(discount)
      .expect(res => {
        res.body.msg.should.equal('Only admin users are authorized to perform this operation.')
      })
      .expect(401, done);
  });

  it('Should throw an error on attempt to get discounts if user is not admin', done => {
    agent
      .get('/discounts')
      .expect(res => {
        res.body.msg.should.equal('Only admin users are authorized to perform this operation.')
      })
      .expect(401, done);
  });

  it('Should throw an error on attempt to edit a discount if user is not admin', done => {
    agent
      .put('/discounts/test')
      .expect(res => {
        res.body.msg.should.equal('Only admin users are authorized to perform this operation.')
      })
      .expect(401, done);
  });

  it('Should throw an error on attempt to delete a discount if user is not admin', done => {
    agent
      .post('/discounts/test/expire')
      .expect(res => {
        res.body.msg.should.equal('Only admin users are authorized to perform this operation.')
      })
      .expect(401, done);
  });

  it('Should store a new discount if user is admin', done => {
    getUserPr('users',user._id)
    .then(userFromDb => {
      userFromDb.userType = 'admin';
      insertUserPr('users',userFromDb)
      .then(function(resp) {
        user._rev = resp.rev;
        agent
          .post('/discounts')
          .send(discount)
          .expect(res => {
            discount._rev = res.body.rev;
            res.body.id.should.equal('testdiscount');
          })
          .expect(200, done);
      })
    })
  });

  it('Should get discounts if user is admin', done => {
    agent
      .get('/discounts')
      .expect(res => {
        res.body.should.have.property('total_rows');
      })
      .expect(200, done);
  });

  it('Should be able to edit a discount', done => {
    discount.percent = '12';
    agent
      .put(`/discounts/${discount.id}`)
      .send(discount)
      .then((res) => {
        discount._rev = res.body.rev;
        discountRev = res.body.rev;
        getDiscountPr('discounts',discount.id)
        .then(resp => {
          resp.percent.should.equal(0.12);
          done();
        }) 
      })
      .expect(200);
  });

  it('Should be able to delete a discount', done => {
    agent
      .post(`/discounts/${discount._id}/expire`)
      .then(res => {
        discountRev = res.body.rev;
        getDiscountPr('discounts',discount.id)
        .then(discount => {
          let date = new Date();
          let dateDiff = date > new Date(discount.endDate);
          dateDiff.should.equal(true);
          done();
        })
      })
      .expect(200);
  });

  after(done => {
    var cleanupDiscount = cb => {
      dbService.discounts.deleteDoc(discount.id, discountRev, cb);
    };

    var cleanupUser = cb => {
      dbService.users.deleteDoc(user._id, user._rev, cb);
    };

    async.parallel([cleanupDiscount, cleanupUser], done);
  });
});
