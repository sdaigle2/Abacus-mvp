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
      .post('/login')
      .send({
        email: userObj.email,
        password: userObj.password
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
      .post('/register')
      .send(userObj)
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

exports.newUser = app => {
  return exports.fromUser(app, createNewUser());
};

