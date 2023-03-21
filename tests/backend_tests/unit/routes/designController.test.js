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
      .post('/designs')
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
      .get(`/designs/${dummyDesign._id}`)
      .expect(res => {
        res.should.have.property("body");

        _.isEqual(res.body, dummyDesign).should.equal(true);
      })
      .expect(200, done);
  });

  it('Should be able to update the design object', done => {
    dummyDesign = _.merge(dummyDesign, {'hi': 5}); // adds a hi attribute to dummyDesign with value 5

    agent
      .put(`/designs/${dummyDesign._id}`)
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
      dbService.deleteFromDBfunction('users', user._id, user._rev, cb)
      // dbService.users.deleteDoc(user._id, user._rev, cb);
    };

    var cleanupDesign = cb => {
      dbService.deleteFromDBfunction('designs', dummyDesign._id, dummyDesign._rev, cb)
      // dbService.designs.deleteDoc(dummyDesign._id, dummyDesign._rev, cb);
    };

    async.parallel([cleanupDesign, cleanupUser], done);
  });

});

describe('Tests Wheelchair pdf generation', function () {
  var user = null;
  var agent = null;
  var sampleDesign = _.first(require('../../../test_assets/json_samples/chairs.json'));
  sampleDesign = _.omit(sampleDesign, ['creator', '_id', '_rev']);

  var pdfDownloadURL_ID = null; // will store download URL for ID specified request
  var pdfDownloadURL_Body = null; // will store download URL for body specified request

  before(done => {
    getLoggedInAgent.newUser(app)
      .then(result => {
        user = result.user;
        agent = result.agent;
        sampleDesign.creator = user._id;
        done();
      })
      .catch(done);
  });

  it('Should create a design object', done => {
    agent
      .post('/designs')
      .send(sampleDesign)
      .expect(res => {
        res.should.have.property("body");

        res.body.should.have.property("creator");
        res.body.creator.should.equal(sampleDesign.creator);

        res.body.should.have.property('rev');
        res.body.should.have.property('id');

        // Attach ID and revision number for next tests
        sampleDesign._id = res.body.id;
        sampleDesign._rev = res.body.rev;
      })
      .expect(200, done);
  });

  it('Should send request to backend to generate the PDF with design given in body', function (done) {
    this.timeout(20e3); // this request doesnt complete until the pdf is generated so it takes a while

    agent
      .post('/design-drawings')
      .send(sampleDesign)
      .expect(res => {
        res.should.have.property('body');

        res.body.should.have.property('filename');
        res.body.should.have.property('url');

        pdfDownloadURL_Body = res.body.url; // set the url for the next test that attempts to download the pdf
      })
      .expect(200, done);
  });

  it('Should download PDF from URL from body specified request', done => {
    agent
      .get(pdfDownloadURL_Body)
      .expect(200, done);
  });

  after(done => {
    dbService.deleteFromDBfunction('designs', sampleDesign._id, sampleDesign._rev, done)
    // dbService.designs.deleteDoc(sampleDesign._id, sampleDesign._rev, done);
  });


});