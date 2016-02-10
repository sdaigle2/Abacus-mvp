/**
 * Created by Dhruv on 6/16/2015.
 */
"use strict";

//Security library. Validates client sent data and implements password hashing

var crypto = require('crypto');
var addressValidator = require('address-validator');
var _ = require('lodash');
var Address = addressValidator.Address;
var len = 128;
var iterations = 12000;

//Checks that all parameters are strings
function typeCheck(userData){
  if(typeof userData.fName !== 'string')
    return 'Invalid First Name';
  if(typeof userData.lName !== 'string')
    return 'Invalid Last Name';
  if(typeof userData.email !== 'string')
    return 'Invalid Email';
  if(typeof userData.phone !== 'string')
    return 'Invalid Phone Number';
  if(typeof userData.addr !== 'string')
    return 'Invalid Address';
  if(typeof userData.addr2 !== 'string')
    return 'Invalid Address';
  if(typeof userData.city !== 'string')
    return 'Invalid City';
  if(typeof userData.state !== 'string')
    return 'Invalid State';
  if(typeof userData.zip !== 'string')
    return 'Invalid Zip';
  if(typeof userData.password !== 'string')
    return 'Invalid Password';
  return true;
}

function addressCheck(userData){
  var address = new Address({
    street: userData.addr,
    city: userData.city,
    state: userData.state,
    country: 'US'
  });
  addressValidator.validate(address, addressValidator.match.streetAddress, function(err, exact, inexact){
    console.log('input: ', address.toString());
    console.log('match: ', _.map(exact, function(a) {
      return a.toString();
    }));
    console.log('did you mean: ', _.map(inexact, function(a) {
      return a.toString();
    }));

    //access some props on the exact match
    var first = exact[0];
    console.log(first.streetNumber + ' '+ first.street);
  });
  return true;
}

function passwordCheck(password, confirm, res){
  if (password.length < 8) {
    return 'Password should have atleast 8 characters';
  }
  else if (password !== confirm) {
    return 'Passwords do not match';
  }
  return true;
}

//Function to hash a password
exports.hash = function (pwd, salt, fn) {
  if (3 == arguments.length) {//salt provided
    crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){//hash password with given salt
      fn(err, hash.toString('base64'));
    });
  } else {
    fn = salt;
    crypto.randomBytes(len, function(err, salt){
      if (err) return fn(err);
      salt = salt.toString('base64');//generate random salt
      crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
        if (err) return fn(err);
        fn(null, salt, hash.toString('base64'));
      });
    });
  }
};

//Function to check register data
exports.check = function(userData) {
  var err = typeCheck(userData) && passwordCheck(userData.password, userData.confirm);
  if(err!==true)
    return err;
  return true;
};
