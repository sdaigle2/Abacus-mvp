/**
 * Created by sourabhdesai on 4/26/16.
 *
 * Returns a logged-in agent instance so you can access backend functionality that requires that you've logged in
 */

const request = require('supertest');
const Chance  = require('chance');
const _       = require('lodash');

const createNewUser = require('./createNewUser');

const chance = new Chance();

// Takes an express app & a user that has already been registered
// and returns a supertest agent that is logged in as that user
exports.fromExistingUser = (app, userObj) => {
  var agent = request.agent(app);
  // this promise resolves to a logged in supertest agent object
  return new Promise((resolve, reject) => {
    agent
      .post('/users/email/sign-in/' + userObj.email)
      .send({
        password: userObj.password
      })
      .expect(res => {
        res.should.have.property("body");
        res.body.should.have.property("email");
        res.body.email.should.equal(userObj.email);

        res.body.should.have.property('_id');
        userObj._id = res.body._id;

        res.body.should.have.property('_rev');
        userObj._rev = res.body._rev;
      })
      .expect(200, err => {
        if (err) {
          reject(err);
        } else {
          resolve(agent);
        }
      });
  });
};

// Takes n express app and a user that isnt registered
// and returns a supertest agent that is logged in as that user
exports.fromUser = (app, userObj) => {
  return new Promise((resolve, reject) => {
    request(app)
      .post('/users/register')
      .send(userObj)
      .expect(res => {
        res.should.have.property("body");
        res.body.should.have.property('success');
        res.body.success.should.equal(true);
      })
      .expect(200, err => {
        if (err) {
          reject(err);
        } else {
          exports.fromExistingUser(app, userObj)
            .then(agent => resolve(agent))
            .catch(reject);
        }
      });
  });
};

// Returns promise that resolves to an object containing the logged-in request agent + the logged-in user object
exports.newUser = app => {
  var user = createNewUser();
  return exports.fromUser(app, user)
    .then(agent => {
      return {
        "agent": agent,
        "user": user
      };
    });
};

