/**
 * Created by sourabhdesai on 5/6/16.
 */

const _ = require('lodash');

const generateUniqueID = require('../../../../server_scripts/services/generateUniqueID');
const db = require('../../../../server_scripts/services/db');

describe('Test to make sure that unique IDs can be generated', () => {
  it('Should generate a unique ID for a design', done => {
    generateUniqueID(db.designs, (err, uniqueID) => {
      if (err) {
        return done(err);
      }

      uniqueID.should.be.String();

      done();
    })
  });
});
