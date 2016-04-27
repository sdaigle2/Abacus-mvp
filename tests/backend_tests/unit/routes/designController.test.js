/**
 * Created by sourabhdesai on 4/26/16.
 *
 * Tests for saving, retrieving, and updating designs
 */

const request = require('supertest');
const Chance = require('chance');

const getLoggedInAgent = require('../../helpers/getLoggedInAgent');

const chance = new Chance();

before(done => {
  if (typeof app === 'undefined') {
    done(new Error('Something went wrong in bootstrapping'));
  } else {
    done();
  }
});

describe('Test CRUD Ops', () => { // no delete functionality right now
  var agent = null;
  var user = null;

  var dummyDesign = null;

  before(function (done) {
    this.timeout(5e3);

    getLoggedInAgent.newUser(app)
      .then(result => {
        agent = result.agent;
        user = result.user;

        dummyDesign = {
          "creator": user.email,
          "key": chance.string()
        };

        done();
      })
      .catch(done);
  });

  it('Should make a design object', done => {
    agent
      .post('/design')
      .send(dummyDesign)
      .expect(res => {
        res.should.have.property("body");

        res.body.should.have.property("creator");
        res.body.creator.should.equal(dummyDesign.creator);

        res.body.should.have.property("key");
        res.body.key.should.equal(dummyDesign.key);

        res.body.should.have.property('rev');
        res.body.should.have.property('id');
      })
      .expect(200, done);
  });

});
