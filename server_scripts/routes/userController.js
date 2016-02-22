/**
 * Contains any necessary CRUD routes for user object
 */
"use strict";

var router = require('express').Router();

// Import services
var update = require('../services/user').update;

// Import policies
var restrict = require('../policies/restrict');

//UPDATE USER INFO
router.post('/update', restrict, function (req, res) {
  console.log('/update');

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
    oldPass: req.body.oldPass,
    newPass1: req.body.newPass1,
    newPass2: req.body.newPass2,
    unitSys: 0,
    currentWheelchair: req.body.currentWheelchair,
    cartWheelchairs: req.body.cartWheelchairs
  };
  update(data, req.session.user, function (err, body, errNo) { //Main update logic, passing data as new obj and the session cookie as the key
    //CALLBACK
    //Regenerate the session cookie
    req.session.regenerate(function () {
      req.session.user = body.id;
      var message = '';
      //Use the error number to alert the user
      switch (errNo) {
        case 1: message = 'New password is not valid';
              break;
        case 2: message = 'Current password is incorrect';
              break;
        case 3: message = 'Password Changed';
              break;
      }
      res.json({'err': err, 'message': message});
    });
  });
});

module.exports = router; // expose the router
