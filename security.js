/**
 * Created by Dhruv on 6/16/2015.
 */
var crypto = require('crypto');
var len = 128;
var iterations = 12000;

/**
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} password to hash
 * @param {String} optional salt
 * @param {Function} callback
 * @api public
 */

function typeCheck(userData){
  if(typeof userData.fName !== 'string')
    return false;
  if(typeof userData.lName !== 'string')
    return false;
  if(typeof userData.email !== 'string')
    return false;
  if(typeof userData.phone !== 'string')
    return false;
  if(typeof userData.addr !== 'string')
    return false;
  if(typeof userData.addr2 !== 'string')
    return false;
  if(typeof userData.city !== 'string')
    return false;
  if(typeof userData.state !== 'string')
    return false;
  if(typeof userData.zip !== 'string')
    return false;
  if(typeof userData.password !== 'string')
    return false;
  return true;
}

exports.hash = function (pwd, salt, fn) {
  if (3 == arguments.length) {
    crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
      fn(err, hash.toString('base64'));
    });
  } else {
    fn = salt;
    crypto.randomBytes(len, function(err, salt){
      if (err) return fn(err);
      salt = salt.toString('base64');
      crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
        if (err) return fn(err);
        fn(null, salt, hash.toString('base64'));
      });
    });
  }
};

exports.check = function(userData) {
  if(!typeCheck(userData))
    return false;
  return true;
};
