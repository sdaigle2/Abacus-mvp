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
  var latestUserRev = ''; 
  var resetLink = '';
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

  it('Should successfully change password', done => {
    agent
      .put('/change-user-password')
      .send({
        email: user.email,
        newPassword: 'newPassword'
      })
      .expect(res => {
        res.should.have.property('body');
        res.body.success.should.equal(true);
      })
      .expect(200, done);
  });

  it('Should throw 400 if new password is less than 8 characters', done => {
    agent
      .put('/change-user-password')
      .send({
        email: user.email,
        newPassword: '5char'
      })
      .expect(res => {
        res.should.have.property('body');
        res.body.msg.should.equal('New password should be at least 8 characters long');
      })
      .expect(400, done);
  });

  it('Should throw 404 if provided email does not correspond to a valid user', done => {
    agent
      .put('/change-user-password')
      .send({
        email: 'unexisting@mail.com',
        newPassword: 'newPassword'
      })
      .expect(res => {
        res.should.have.property('body');
        res.body.msg.should.equal('No user found with email unexisting@mail.com');
      })
      .expect(404, done);
  });

  it('Should request a reset link if user with provided email exists', done => {
    agent
      .post('/reset-link/' + user.email)
      .expect(res => {
        res.should.have.property('body');
        res.body.success.should.equal(true);
        latestUserRev = res.body.newRev;
        resetLink = res.body.resetLink;
      })
      .expect(200, done);
  });

  it('Should throw 404 if user with provided email does not exist', done => {
    agent
      .post('/reset-link/unexisting@mail.com')
      .expect(res => {
        res.should.have.property('body');
        res.body.msg.should.equal('No user found with email unexisting@mail.com')
      })
      .expect(404, done);
  });

  it('Should throw 404 if reset-link does not exist in the user object', done => {
    agent
      .get('/password-reset-key/unexisting')
      .expect(res => {
        res.should.have.property('body');
      })
      .expect(404, done);
  });

  it('Should send 200 if reset-link does exist', done => {
    agent
      .get('/password-reset-key/' + resetLink)
      .expect(res => {
        res.should.have.property('body');
        res.body.success.should.equal(true);
      })
      .expect(200, done);
  });

  after(done => {
    dbService.users.deleteDoc(user._id, latestUserRev, done);
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
