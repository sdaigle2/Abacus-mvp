/**
 * Created by sourabhdesai on 4/26/16.
 *
 * Creates a new user with randomly populated attributes
 */

const Chance  = require('chance');
const _       = require('lodash');

const chance = new Chance();

const TEST_EMAIL_DOMAIN = 'intelliwheels_development.com';

module.exports = () => {
  var password = chance.string({length: 9}); // password should be at least 8 chars
  return {
    fName: chance.first(),
    lName: chance.last(),
    email: chance.email({domain: TEST_EMAIL_DOMAIN}),
    phone: chance.phone(),
    addr: chance.address(),
    addr2: '',
    city: chance.city(),
    state: chance.state(),
    zip: chance.zip(),
    password: password,
    confirm: password, //Second typing of password
    unitSys: 0,
    orders: [],
    savedDesigns: [],
    cart: null
  };
};
