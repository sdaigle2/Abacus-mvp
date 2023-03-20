/**
 * Contains any necessary CRUD routes for user object
 */
'use strict';

const router = require('express').Router();
const _ = require('lodash');
const promise = require('bluebird');

// Import services
const update = require('../services/user').update;
const fixObject = require('../services/user').fixObject;
const dbUtils   = require('../services/dbUtils');
const dbService = require('../services/db');
const updateOrInsertAllEntriesPr = promise.promisify(dbUtils.updateOrInsertAllEntries);
const getUserPr = promise.promisify(dbService.findDB);
const insertUserPr = promise.promisify(dbService.insertDB);
const hash      = require('../services/security').hash;

// Import policies
const restrict = require('../policies/restrict');

const _designFunctionId = '90e3fa2f51a7470a708c7aede3121ccf';

router.get('/users', restrict, function(req, res) {
  getUserPr('users',req.session.user)
  .then(function(user) {
    const userType = user.userType;
    if (userType !== 'admin' && userType !== 'superAdmin') {
      res.status(401);
      res.json({msg: 'Only admin users are authorized to perform this operation.'});
      return;
    }
    dbService.listAllfunction('users', function(err, body){
      if (err) {
        res.status(400);
        res.json({err: 'Error while getting users'});
        return;
      }
      res.json(body);
    });
  })
  .catch(err => {
    res.status(400);
    res.json({err: err});
  });
});

router.put('/users/:userId', restrict, function(req, res) {
  getUserPr('users',req.session.user)
  .then(function(user) {
    const userType = user.userType;
    if (userType !== 'superAdmin') {
      res.status(401);
      res.json({msg: 'Only admin users are authorized to perform this operation.'});
      return;
    }
    return insertUserPr('users',req.body.userObj) 
  })
  .then(function(resp) {
    res.json(resp);
  })
  .catch(err => {
    res.status(404);
    res.json({err: err});
  });
});

router.post('/users/current/current-wheelchair', restrict, function(req, res) {
  var updateData = {
    'currentWheelchair': req.body.currentWheelchair
  }
  updateUserObj(req.body.currentWheelchair, 'currentWheelchair', req, res);
});

router.post('/users/current/designs', restrict, function (req, res) {
  // console.log("/users/current/designs")
  var updateData = {
    'savedDesigns': req.body.savedDesigns
  }
  updateUserObj(req.body.savedDesigns,'savedDesigns' , req, res);
});

router.post('/users/current/info', restrict, function (req, res) {
  // console.log('/users/current/info')
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
  // finding the object in database
  getUserPr('users',req.session.user) 
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

      dbService.inplaceAtomicFunction('users',req.session.user,obj,cb)
      // dbService.users.atomic(_designFunctionId, 'inplace', req.session.user, obj, cb);
    } else {
      hash(obj.oldPass, existing.salt, function (err, oldHash) {
        if (oldHash !== existing.password) {
          delete obj.oldPass;
          delete obj.newPass1;
          delete obj.newPass2;
          errNo = 2;
          dbService.inplaceAtomicFunction('users',req.session.user,obj,cb)
          // dbService.users.atomic(_designFunctionId, 'inplace', req.session.user, obj, cb);
        } else {
          hash(obj.newPass1, function (err, salt, hash) {
            if (err) throw err;
            obj.password = hash;
            obj.salt = salt;
            delete obj.oldPass;
            delete obj.newPass1;
            delete obj.newPass2;
            errNo = 3;
            dbService.inplaceAtomicFunction('users',req.session.user,obj,cb)
            // dbService.users.atomic(_designFunctionId, 'inplace', req.session.user, obj, cb);
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
  console.log('/users/current/cart')
  var cart = req.body.cart;
  // dbService.service.postBulkDocs({
  //   db: 'orders',
  //   bulkDocs: {  'docs': [cart]}
  // })
  updateOrInsertAllEntriesPr({
      db: 'orders',
      dbInsert: dbUtils.insertOrder,
      idField: '_id',
      entries: [cart]
    }
      // .then(function (cartArr) {
        ,function (err, cartArr) {
          if (err) {
            console.log(err)
            res.json({
              'err': err
            });
          } 
          else{
          console.log('call back of updateOrInsertAllEntriesPr from userController')
      // cartArr=cartArr.result
      var cart = _.first(cartArr);
      // console.log(cart)
      var cart_id= cart.id
      if(cart.id === undefined)
          cart_id = cart._id
      var updateData = {
        'cart': cart_id
      };
      var userID = req.session.user;
      console.log("try updating the user: ", cart_id)
      dbService.inplaceAtomicFunction('users', userID, cart_id, 'cart' ,cb)
      // dbService.users.atomic(_designFunctionId, 'inplace', userID, updateData, cb);
      function cb(error, response) {
        if (error) {
          console.log(error)
          res.json({
            'err': error
          });
        } else {
          req.session.regenerate(async function () {
            req.session.user = userID;
            updateData._rev = response;
            updateData.userID = userID;
            // console.log(cart.id)
            // var data = await dbService.findDB('orders',cart.id) 
            res.send(cart);
          });
        }
      }
    }
    })
    .catch(function(err) {
      console.log(err)
      res.json({
        'err': err
      });
    })
});

function updateUserObj(updateData, updateField, req, res) {
  console.log("update user object")
  var userID = req.session.user;
  dbService.inplaceAtomicFunction('users',userID,updateData,updateField,cb)
  // dbService.users.atomic(_designFunctionId, 'inplace', userID, updateData, cb);
  function cb(error, response) {
    if (error) {
      res.json({
        'err': error
      });
    } else {
      // console.log(response)
      req.session.regenerate(function () {
        req.session.user = userID;
        var newData={}
        newData[updateField] = updateData
        newData._rev = response;
        newData.userID = userID;
        res.send(newData);
      });
    }
  }
}

module.exports = router; // expose the router
