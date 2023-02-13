const request = require('supertest');
const Chance = require('chance');

const getLoggedInAgent = require('../../helpers/getLoggedInAgent');
const dbService = require('../../../../server_scripts/services/db');
const promise = require('bluebird');
const getUserPr = promise.promisify(dbService.findDB);
const insertUserPr = promise.promisify(dbService.insertDB);

const chance = new Chance();
let user;

before(done => {
  if (typeof app === 'undefined') {
    done(new Error('Something went wrong in bootstrapping'));
  } else {
    done();
  }
});

describe('Test userController', () => {
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

  it('Should throw an error on attempt to get users list if user is not admin', done => {
    agent
      .get('/users')
      .expect(res => {
        res.body.msg.should.equal('Only admin users are authorized to perform this operation.')
      })
      .expect(401, done);
  });

  it('Should throw an error on attempt to change userType if user is not superAdmin', done => {
    agent
      .put('/users/test')
      .expect(res => {
        res.body.msg.should.equal('Only admin users are authorized to perform this operation.')
      })
      .expect(401, done);
  });

  it('Should get users list if user is admin', done => {
    getUserPr('users',user._id)
    .then(userFromDb => {
      userFromDb.userType = 'superAdmin';
      insertUserPr('users',userFromDb)
      .then(function(resp) {
        user._rev = resp.rev;
        agent
          .get('/users')
          .expect(res => {
            res.body.should.have.property('total_rows');
          })
          .expect(200, done);
      })
    })
  });

  it('Should change userType if user is superAdmin', done => {
    agent
      .put(`/users/${user._id}`)
      .send({'userObj': user})
      .expect(res => {
        res.body.ok.should.equal(true);
      })
      .expect(200, done);
  });

  after(done => {
    dbService.users.deleteDoc(user._id, user._rev, cb)

    function cb() {
      done();
    }
  });
});
