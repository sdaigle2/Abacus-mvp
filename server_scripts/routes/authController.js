/**
 * Contains all request handlers for authentication endpoints
 * Namely, logging in/out, registration, and session
 */
"use strict";

var router = require('express').Router();
var _      = require('lodash');

// Import services
var dbService = require('../services/db');
var dbUtils   = require('../services/dbUtils');
var sendgrid  = require('../services/sendgrid');
var hash      = require('../services/security').hash;
var check     = require('../services/security').check;

// Import Policies
var restrict = require('../policies/restrict');

var email = new sendgrid.Email({
  from: 'tinker@intelliwheels.net',
  subject: 'Tinker Registration'
});

//LOGIN
router.post('/login', function (req, res) {
  //Retrieve request parameters
  var email = req.body.email;
  var password = req.body.password;

  // Check that the email & password are given and not empty
  if ( !([email, password].every(_.isString)) || [email, password].some(_.isEmpty)) {
    res.status(400);
    res.json({
      'err': "Bad Login: Must Provice an Email and a Password"
    });
    return;
  }

  //Query the database
  dbUtils.getUserByID(email, function (err, body) { //body is the object we retrieve from the successful query
    if (!err) {
      hash(password, body.salt, function (err, hash) { //hash the password using the stored salt
        if (err)
          res.json({'userID': -1});
        else if (hash === body.password) { //Compare hashed password with stored hash

          //Create a session cookie for the logged in user
          req.session.regenerate(function () {
            req.session.user = body.email;
            delete body.salt;
            delete body.password;
            res.json(body); //Respond with object from database AFTER removing the password hash and salt
          });
        }
        else
          res.json({'userID': -1});
      });
    }
    else {
      console.log(err);
      res.json({'userID': -1});
    }
  });
});

// router.get('/loadMyDesign', function(req,res){
//   var ID = req.body.email;
//   console.log("user ID is" + ID);
//   dbService.users.search('view101','search', {q:'creator:' + ID}, function(err,body){
//     if(!err){
//       res.json(body);
//     }
//     else {
//       res.status(400);
//       res.json(err);
//     }
//   });
//
//
// });

//LOGOUT
router.post('/logout', restrict, function (req, res) {
  //Destroy session cookie
  req.session.destroy(function () {
    res.send('success');
  });
});

//Check user session on page reload
router.post('/session', restrict, function (req, res) {
  dbUtils.getUserByID(req.session.user, function (err, body) { //Query the database using the session cookie
    if (!err) {
      delete body.salt;
      delete body.password;
      res.json(body); //Respond with details from database AFTER removing stored hash and salt
    }
    else
      res.json({'userID': -1});
  });
});

//REGISTER
router.post('/register', function (req, res) {
  //Retrieve request parameters that we need, ignoring any others.
  var data = {
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    phone: req.body.phone,
    addr: req.body.addr,
    addr2: req.body.addr2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    password: req.body.password,
    confirm: req.body.confirm, //Second typing of password
    unitSys: 0,
    orders: [],
    savedDesigns: [],
    cart: null
  };

  //Check the parameters for validity. check() defined in security.js
  var checkRes = check(data);
  if (checkRes !== true) {
    res.json({err: checkRes});  //If response is not true, it is an error
  }
  else
    dbService.users.get(data.email, function (err, body) { //Query the database for a user with the given email
      if (err) {  //No user exists, we can continue registering

        //Hash the given password. hash() defined in security.js
        hash(data.password, function (err, salt, hash) {
          if (err) throw err;
          // Store the salt and hash in the database
          data.salt = salt;
          data.password = hash;
          delete data.confirm; //Do not want copy of password

          //Insert new user into database
          dbService.users.insert(data, data.email, function (err, body) {
            if (err) {
              res.status(500);
              res.json({err: 'Couldn\'t save user in the Database'});
              return;
            }
            //Send an email to the user using the sendgrid API
            email.to = data.email;
            email.text = 'Thank you for registering an account with Abacus.';
            sendgrid.send(email, function () {
              res.json({'success': true});
            });
          });
        });
      }
      else { // No error in query means the user exists
        res.json({err: 'user already exists', field: 'email'});
      }
    });
});

module.exports = router; // expose the router
