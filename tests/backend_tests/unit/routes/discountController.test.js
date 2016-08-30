const request = require('supertest');
const Chance = require('chance');

const getLoggedInAgent = require('../../helpers/getLoggedInAgent');
const dbService = require('../../../../server_scripts/services/db');
const promise = require('bluebird');
const getUserPr = promise.promisify(dbService.users.get);
const getOrdersPr = promise.promisify(dbService.orders.get);
const chance = new Chance();

before(done => {
  if (typeof app === 'undefined') {
    done(new Error('Something went wrong in bootstrapping'));
  } else {
    done();
  }
});

describe('Test user updates', () => {
  var discount = {
    id: 'testDiscount',
    percent: 0.01,
    startDate: '2016-06-31T21:00:00.000Z',
    endDate: '2016-12-31T21:00:00.000Z'
  };
  var discountRev = null;


  it('Should not be able to update user info if user is not logged in', done => {
    request(app)
      .post('/discounts')
      .send(discount)
      .expect(res => {
        discountRev = res.body.rev
      })
      .expect(200, done);
  });

  after(done => {
    var cleanupDiscount = cb => {
      dbService.discounts.deleteDoc(discount.id, discountRev, cb);
    };

    async.parallel([cleanupDiscount], done);
  });
});
