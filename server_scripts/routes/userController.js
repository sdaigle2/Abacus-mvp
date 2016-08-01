/**
 * Contains any necessary CRUD routes for user object
 */
'use strict';

var router = require('express').Router();

// Import services
var update = require('../services/user').update;
var dbUtils   = require('../services/dbUtils');
var dbService = require('../services/db');
// Import policies
var restrict = require('../policies/restrict');

var _designFunctionId = '69777e82324ef175df6ee184cc7c93cd';
//UPDATE USER INFO
//TODO: find out if cloudant allows single field update. i.e. update only fName or lName.
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
    // Linked fields
    cart: req.body.cart || null,
    orders: req.body.orders || [],
    savedDesigns: req.body.savedDesigns || []
  };
  update(data, req.session.user, function (err, body, errNo, updatedUserObj) { //Main update logic, passing data as new obj and the session cookie as the key
    //CALLBACK
    if (body) {
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
        res.json({
          'err': err,
          'message': message,
          'user': updatedUserObj
        });
      });
    } else {
      res.json({
        'err': err,
        'user': updatedUserObj
      });
    }
  });
});

router.post('/update-current-wheelchair', restrict, function (req, res) {
  var updateData = {
    'currentWheelchair': req.body.currentWheelchair
  }
  if (req.body._rev) {
    updateData._rev = req.body._rev;
  }

  updateUserObj(updateData, req, res);
});

router.post('/update-saved-designs', restrict, function (req, res) {
  var updateData = {
    'savedDesigns': req.body.savedDesigns
  }
  if (req.body._rev) {
    updateData._rev = req.body._rev;
  }

  updateUserObj(updateData, req, res);
});

function updateUserObj(updateData, req, res) {
  var userID = req.session.user;
  dbService.users.atomic(_designFunctionId, 'inplace', userID, updateData, cb);
  function cb(error, response) {
    if (error) {
      res.json({
        'err': error
      });
    } else {
      req.session.regenerate(function () {
        req.session.user = userID;
        updateData._rev = response;
        updateData.userID = userID;
        res.send(updateData);
      });   
    }
  }
}

module.exports = router; // expose the router
