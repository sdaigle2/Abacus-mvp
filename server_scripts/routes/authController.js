/**
 * Contains all request handlers for authentication endpoints
 * Namely, logging in/out, registration, and session
 */
"use strict";

var router = require('express').Router();
var _      = require('lodash');
var crypto = require('crypto');
var Promise = require("bluebird");

// Import services
var dbService = require('../services/db');
var dbUtils   = require('../services/dbUtils');
var sendgrid  = require('../services/sendgrid');
var hash      = require('../services/security').hash;
var check     = require('../services/security').check;

// Import Policies
var restrict = require('../policies/restrict');

// Email info
var authTplId = 'db5513e7-1cb0-46f7-95bd-1001fbe8c41e';
var resetPasswordTplId = 'dfee1b8d-6729-4674-bd82-da988b65e440';
var emailFrom = 'do-not-reply@per4max.com';

// Promised db functions
var findUserPr = Promise.promisify(dbService.findDB);
var findResentLinkPr = Promise.promisify(dbService.findResetLinkinDB);
var insertUserPr = Promise.promisify(dbService.insertDB);

//RESET PASSWOD LINK
router.post('/users/email/:email/request-reset-password', function (req, res) {
  console.log("resetLink authCOntroller ")
  var userEmail = req.params.email;
  dbService.findDB('users',userEmail)
  .then(function(data) {
    if (data === null) {
      res.status(404);
      res.json({
        msg: 'No user found with email ' + userEmail
      });
      return;
    }
    data.resetLink = crypto.randomBytes(16).toString('hex');
    dbService.insertDBfunction('users', data, function(error,nData) {
      var content = 'To reset your password for per4max.fit, please click the link - http://per4max.fit/#!/change-password/' + data.resetLink;
      sendgrid.send(emailFrom, userEmail, content, 'Per4max Password Reset', resetPasswordTplId, cb)
      function cb(err, resp) {
        if (err) {
          console.log(err)
        } else {
          console.log(resp)
          res.json({'success': true, 'newRev': nData.rev, 'resetLink': data.resetLink});
        }
      }
    })
    .catch(function(err) {
      res.status(500);
      return res.json(err);
    })
  })
});

//CHECKS IF RESET PASSWORD LINK EXISTS
router.get('/users/reset-password-code/:resetPasswordCode/exists', function(req, res) {
  var passwordCode = req.params.resetPasswordCode;
  dbService.findResetLinkinDB('users',passwordCode)
  .then(function(data) {
    if (data === null) {
      res.status(404);
      res.json({
        msg: 'No user found with email ' + userEmail
      });
      return;
    }
    res.json({'success': true});
  })
  .catch(function(err) {
    res.status(500);
    return res.json(err);
  })
});

//CHANGES PASSWORD
router.put('/users/current/change-password', function(req, res) {
  var newPassword = req.body.newPassword;
  var userEmail = req.body.email;
  console.log("Saving new password:",newPassword)
  if (!newPassword && newPassword.length < 8) {
    res.status(400);
    res.json({
      msg: 'New password should be at least 8 characters long'
    });
  } else {
    dbService.findDB('users',userEmail)
    .then(function(data) {
      if (data === null) {
        res.status(404);
        res.json({
          msg: 'No user found with email ' + userEmail
        });
        return;
      } else {
        hash(newPassword, function (err, salt, hash) {
          if (err) {
            console.log(err)
            res.status(500);
            return res.json(err);
          // throw err;
          }
          console.log("Done with hash")
          data.password = hash;
          data.salt = salt;
          console.log("calling inplaceAtomicFunction")
          dbService.inplaceAtomicFunction('users', userEmail, data, null, function(error, body) {
            console.log(error,body)
            if (error) throw error;
            res.json({'success': true});
          })
          .catch(function(err) {
            console.log(err)
            res.status(500);
            return res.json(err);
          })
        });
      }
    })
  }
});

//LOGIN

//TODO: cancel out the console.log( password);

router.post('/users/email/sign-in/:email', function (req, res) {
  console.log('/users/email/sign-in/:email')
  //Retrieve request parameters
  var email = req.params.email;
  var password = req.body.password;
  // Check that the email & password are given and not empty
  if ( !([email, password].every(_.isString)) || [email, password].some(_.isEmpty)) {
    // console.log("couldn't register")
    res.status(400);
    res.json({
      'err': "Bad Login: Must Provide an Email and a Password"
    });
    return;
  }
  //Query the database
  dbUtils.getUserByID(email, function (err, body) { //body is the object we retrieve from the successful query
    // console.log('getUserByID in authController')
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
        else{
          res.json({'userID': -1});
        }
          
      });
    }
    else {
      console.log(err);
      res.json({'userID': -1});
    }
  });
});

//LOGOUT
router.post('/users/current/logout', restrict, function (req, res) {
  //Destroy session cookie
  req.session.destroy(function () {
    res.send('success');
  });
});

//Check user session on page reload
router.get('/users/current', restrict, function (req, res) {
  dbUtils.getUserByID(req.session.user, function (err, body) { //Query the database using the session cookie
    if (!err) {
      //clean the trace
      delete body.salt;
      delete body.password;
      console.log(body)
      res.json(body); //Respond with details from database AFTER removing stored hash and salt
    }
    else
      res.json({'userID': -1});
  });
});

//Check user session on page reload
router.get('/users/update-user-info', restrict, function (req, res) {
  dbUtils.getUserByID(req.session.user, function (err, body) { //Query the database using the session cookie
    if (!err) {
      //clean the trace
      delete body.salt;
      delete body.password;
      console.log(body)
      res.json(body); //Respond with details from database AFTER removing stored hash and salt
    }
    else
      res.json({'userID': -1});
  });
});

//REGISTER
router.post('/users/register', function (req, res) {
  //Retrieve request parameters that we need, ignoring any others.
  var data = {
    _id: req.body.email,
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
    return res.json({err: checkRes});  //If response is not true, it is an error
  }
  else
    //query the database
    data.email = data.email.toLowerCase();
    
    dbService.findDBfunction("users",data.email, function (err, body) { //Query the database for a user with the given email
      if (err) {  //No user exists, we can continue registering

        //Hash the given password. hash() defined in security.js
        hash(data.password, function (err, salt, hash) {
          if (err) throw err;
          // Store the salt and hash in the database
          data.salt = salt;
          data.password = hash;
          delete data.confirm; //Do not want copy of password

          //Insert new user into database
          dbService.insertDBfunction("users",data, function (err, body) {
            if (err) {
              res.status(500);
              res.json({err: 'Couldn\'t save user in the Database'});
              return;
            }
            console.log(emailFrom)
            sendgrid.send(emailFrom, data.email, '.', 'Tinker Registration', authTplId, cb);
            function cb(err) {
              if (err) {
                console.log(err)
              } else {
                res.json({'success': true});
              }
            }
          });
        });
      }
      else { // No error in query means the user exists
        res.json({err: 'user already exists', field: 'email', success: false});
      }
    });
});

module.exports = router; // expose the router
