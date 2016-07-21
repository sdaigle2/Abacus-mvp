const request = require('supertest');
const Chance = require('chance');

const getLoggedInAgent = require('../../helpers/getLoggedInAgent');
const dbService = require('../../../../server_scripts/services/db');
const promise = require('bluebird');
const getPr = promise.promisify(dbService.users.get);
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

  var wheelchair = {
    'currentWheelchair': {
      'new': 'true'
    }
  };

  before(function (done) {

    getLoggedInAgent.newUser(app)
      .then(result => {
        agent = result.agent;
        user = result.user;

        done();
      })
      .catch(done);
  });

  it('Should update wheelchair', done => {
    agent
      .post('/update-current-wheelchair')
      .send(wheelchair)
      .then(() => {
        getPr(user._id).then(function (resp) {
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
      .post('/update-current-wheelchair')
      .expect(res => {
        res.should.have.property('body');
        res.body.should.have.property('userID');
        res.body.userID.should.equal(-1);
      })
      .expect(200, done);
  });

  after(done => {
    var cleanupUser = cb => {
      dbService.users.deleteDoc(user._id, user._rev, cb);
    };
    cleanupUser(done);
  });
});
