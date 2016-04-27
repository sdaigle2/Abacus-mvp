/**
 * Created by sourabhdesai on 4/26/16.
 *
 * Tests for saving, retrieving, and updating designs
 */

const request = require('supertest');
const Chance = require('chance');
const _ = require('lodash');

const chance = new Chance();

before(done => {
  if (typeof app === 'undefined') {
    done(new Error('Something went wrong in bootstrapping'));
  } else {
    done();
  }
});

describe('Test Crud Ops', () => {

  it('Tests something', done => {
    if (1 == 1) {
      done();
    } else {
      done(new Error('Math doesnt seem to work anymore'));
    }
  });

});
