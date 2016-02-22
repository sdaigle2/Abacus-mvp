/**
 * Helper functions for User manipulation
 */
"use strict";

var dbService = require('./db');
var hash = require('../services/security').hash;
var check = require('../services/security').check;

//Replace any bad request parameters with their existing value in the database
function fixObject(obj, existing) {
  // All the properties that need to be checked
  var STRING_PROPS = ['fName' ,'lName' ,'email' ,'phone' ,'addr' ,'addr2' ,'city' ,'state' ,'zip'];

  // Loop through the required string properties, set them to the existing property if the new obj has a bad value for it
  STRING_PROPS.forEach(function (property) {
    if (typeof obj[property] !== 'string' || !obj[property]) {
      obj[property] = existing[property];
    }
  });
}

// Updates the given user object
exports.update = function (obj, key, callback) {
  //Query the database for the existing user
  dbService.users.get(key, function (error, existing) {

    //Sanitize the obj to be inserted
    fixObject(obj, existing);
    obj._rev = existing._rev; //Copying the revision number is necessary for an update

    //Set the password in the object, may be replaced later
    obj.password = existing.password;
    obj.salt = existing.salt;

    //Make sure the orders are not removed
    obj.orders = existing.orders;
    if (!error) {
      if (!obj.newPass1 || obj.newPass1.length < 8 || obj.newPass1 !== obj.newPass2) { //If the new password doesn't exist, is too short or does not match the confirmation
        console.log('bad newpass');
        //Insert new object without replacing the password
        delete obj.oldPass;
        delete obj.newPass1;
        delete obj.newPass2;
        dbService.users.insert(obj, key, function(err, body){
          callback(err, body, 1);
        });
      } else {
        //Check the old password as we would for login
        hash(obj.oldPass, existing.salt, function (err, oldHash) {
          if (oldHash !== existing.password) { //Hashes do no match
            console.log('wrong pass');
            //Insert new object without replacing the password
            delete obj.oldPass;
            delete obj.newPass1;
            delete obj.newPass2;
            dbService.users.insert(obj, key, function(err, body){
              callback(err, body, 2);
            });
          } else {
            //Hash the new password with a new salt
            hash(obj.newPass1, function (err, salt, hash) {
              if (err) throw err;
              console.log('password changed');
              // store the new salt & hash in the object and insert
              obj.password = hash;
              obj.salt = salt;
              delete obj.oldPass;
              delete obj.newPass1;
              delete obj.newPass2;
              dbService.users.insert(obj, key, function(err, body){
                callback(err, body, 3);
              });
            });
          }
        });
      }
    }
  });
};