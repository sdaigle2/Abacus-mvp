/**
 * Created by sourabhdesai on 4/26/16.
 *
 * Tests for saving, retrieving, and updating designs
 */

const request = require('supertest');
const Chance = require('chance');

const getLoggedInAgent = require('../../helpers/getLoggedInAgent');
const dbService = require('../../../../server_scripts/services/db');

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

        // Attach ID and revision number for next tests
        dummyDesign._id = res.body.id;
        dummyDesign._rev = res.body.rev;
      })
      .expect(200, done);
  });

  it('Should be able to fetch a design given the design ID', done => {
    agent
      .get(`/design/${dummyDesign._id}`)
      .expect(res => {
        res.should.have.property("body");

        _.isEqual(res.body, dummyDesign).should.equal(true);
      })
      .expect(200, done);
  });

  it('Should be able to update the design object', done => {
    dummyDesign = _.merge(dummyDesign, {'hi': 5}); // adds a hi attribute to dummyDesign with value 5

    agent
      .put(`/design/${dummyDesign._id}`)
      .send(dummyDesign)
      .expect(res => {
        res.should.have.property("body");

        // Make sure unchanged values remain unchanged
        res.body.should.have.property("creator");
        res.body.creator.should.equal(dummyDesign.creator);

        res.body.should.have.property("key");
        res.body.key.should.equal(dummyDesign.key);

        res.body.should.have.property('_id');
        res.body._id.should.equal(dummyDesign._id);

        // Newer revision numbers are lexicographically higher than preceding revision numbers
        // Because the first number in it is always incremented
        res.body.should.have.property('_rev');
        res.body._rev.should.be.greaterThan(dummyDesign._rev);

        dummyDesign._rev = res.body._rev; // update the revision number
      })
      .expect(200, done);
  });

  after(done => {
    var cleanupUser = cb => {
      dbService.users.deleteDoc(user._id, user._rev, cb);
    };

    var cleanupDesign = cb => {
      dbService.designs.deleteDoc(dummyDesign._id, dummyDesign._rev, cb);
    };

    async.parallel([cleanupDesign, cleanupUser], done);
  });

});
