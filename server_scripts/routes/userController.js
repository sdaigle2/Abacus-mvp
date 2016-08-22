/**
 * Contains any necessary CRUD routes for user object
 */
'use strict';

var router = require('express').Router();
var _ = require('lodash');
var promise = require('bluebird');

// Import services
var update = require('../services/user').update;
var fixObject = require('../services/user').fixObject;
var dbUtils   = require('../services/dbUtils');
var dbService = require('../services/db');
var updateOrInsertAllEntriesPr = promise.promisify(dbUtils.updateOrInsertAllEntries);
var getUserPr = promise.promisify(dbService.users.get);
var hash      = require('../services/security').hash;

// Import policies
var restrict = require('../policies/restrict');

var _designFunctionId = '90e3fa2f51a7470a708c7aede3121ccf';

router.post('/users/current/current-wheelchair', restrict, function (req, res) {
  var updateData = {
    'currentWheelchair': req.body.currentWheelchair
  }
  updateUserObj(updateData, req, res);
});

router.post('/users/current/designs', restrict, function (req, res) {
  var updateData = {
    'savedDesigns': req.body.savedDesigns
  }
  updateUserObj(updateData, req, res);
});

router.post('/users/current/info', restrict, function (req, res) {
  var errNo = null;
  var obj = {
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
    newPass2: req.body.newPass2
  };
  var userID = req.session.user;
  getUserPr(req.session.user)
  .then(function (existing) {
    //Sanitize the obj to be inserted
    fixObject(obj, existing);
    obj._rev = existing._rev;
    //Set the password in the object, may be replaced later
    obj.password = existing.password;
    obj.salt = existing.salt;

    if (!obj.newPass1 || obj.newPass1.length < 8 || obj.newPass1 !== obj.newPass2) {
      if (obj.newPass1 && obj.newPass1.length < 8 || obj.newPass1 !== obj.newPass2) {
        errNo = 1;
      }
      delete obj.oldPass;
      delete obj.newPass1;
      delete obj.newPass2;

      dbService.users.atomic(_designFunctionId, 'inplace', req.session.user, obj, cb);
    } else {
      hash(obj.oldPass, existing.salt, function (err, oldHash) {
        if (oldHash !== existing.password) {
          delete obj.oldPass;
          delete obj.newPass1;
          delete obj.newPass2;
          errNo = 2;
          dbService.users.atomic(_designFunctionId, 'inplace', req.session.user, obj, cb);
        } else {
          hash(obj.newPass1, function (err, salt, hash) {
            if (err) throw err;
            obj.password = hash;
            obj.salt = salt;
            delete obj.oldPass;
            delete obj.newPass1;
            delete obj.newPass2;
            errNo = 3;
            dbService.users.atomic(_designFunctionId, 'inplace', req.session.user, obj, cb);
          });
        }
      });
    }

    function cb(err, resp) {
      if (errNo) {
        req.session.regenerate(function () {
          req.session.user = userID;
          var message = '';
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
            'user': obj
          });
        });
      } else {
        req.session.regenerate(function () {
          req.session.user = userID;
          res.json({
            'err': err,
            'user': obj
          });
        });
      }
    }
  })
  .catch(function(err) {
    res.json({
      'err': err
    });
  })
});

router.post('/users/current/cart', restrict, function (req, res) {
  var cart = req.body.cart;
  updateOrInsertAllEntriesPr({
      db: dbService.orders,
      dbInsert: dbUtils.insertOrder,
      idField: '_id',
      entries: [cart]
    }).then(function (cartArr) {
      var cart = _.first(cartArr);
      var updateData = {
        'cart': cart.id
      };
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
            res.send(cart);
          });
        }
      }
    })
    .catch(function(err) {
      res.json({
        'err': err
      });
    })
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
