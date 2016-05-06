/**
 * Created by sourabhdesai on 5/6/16.
 *
 * Tests for making sure registration/log in works as expected
 */

const request = require('supertest');
const Chance = require('chance');

const createNewUser = require('../../helpers/createNewUser');
const dbService = require('../../../../server_scripts/services/db');

const chance = new Chance();

before(done => {
  if (typeof app === 'undefined') {
    done(new Error('Something went wrong in bootstrapping'));
  } else {
    done();
  }
});

describe('Simulates Registration, Log-in, Log-out', function () {
  var agent = null;
  var user = createNewUser();

  before(done => {
    agent = request.agent(app);
    done();
  });

  it('Should register a new user', done => {
    agent
      .post('/register')
      .send(user)
      .expect(res => {
        res.should.have.property('body');
        res.body.should.have.property('success');
        res.body.success.should.equal(true);
      })
      .expect(200, done);
  });

  it('Should be able to login with registered user', done => {
    agent
      .post('/login')
      .send({
        email: user.email,
        password: user.password
      })
      .expect(res => {
        res.should.have.property('body');

        res.body.should.have.property('email');
        res.body.email.should.equal(user.email);

        res.body.should.have.property('_id');
        res.body.should.have.property('_rev');

        // Attach for future requests
        user._id = res.body._id;
        user._rev = res.body._rev;
      })
      .expect(200, done);
  });

  it('Should be able to maintain a session after logging in', done => {
    agent
      .post('/session')
      .expect(res => {
        res.should.have.property('body');

        res.body.should.have.property('email');
        res.body.email.should.equal(user.email);
      })
      .expect(200, done);
  });

  after(done => {
    dbService.users.deleteDoc(user._id, user._rev, done);
  });

});

describe('Should not have a session before logging in', () => {

  it('Should not be able to retrieve session info before logging in', done => {
    request(app)
      .post('/session')
      .expect(res => {
        res.should.have.property('body');
        res.body.should.have.property('userID');
        res.body.userID.should.equal(-1);
      })
      .expect(200, done);
  });

});
