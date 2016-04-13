/**
 * Endpoints for saving and fetching designs by SearchID
 */
"use strict";

var router  = require('express').Router();
var shortid = require('shortid');
var _       = require('lodash');

// Import services
var dbService = require('../services/db');
var generateUniqueID = require('../services/generateUniqueID');

// Import policies
var restrict = require('../policies/restrict');

var REQUIRED_DESIGN_PROPERTIES = []; // TODO: Fill list with required properties

// fetch design
router.get('/design/:id',function(req,res){
  var id = req.params.id;
  //query the database
  dbService.designs.get(id,function(err,body){
    if (err) {
      res.status(404);
      res.json({
        msg: 'Did not find the matching design, please try again',
        err: err
      });
    } else {
      res.json(body); //load the design if id is correct
    }
  });
});

// post design
router.post('/design', restrict, function (req, res) {
  var userDesign = req.body;
  // Check that uploaded design has some required properties
  var hasRequiredProps = REQUIRED_DESIGN_PROPERTIES.every(function (property) {
    return property in userDesign;
  });

  if (hasRequiredProps) {
    // Save the design in cloudant
    generateUniqueID(dbService.designs, function (err, uniqueID) {
      dbService.designs.insert(userDesign, uniqueID, function (err, body, header) {
        if (err) {
          console.log(err);
          res.status(400);
          res.json({err: 'Couldn\'t save design data into databse'});
        } else {
          // design save was a success; send the design info back to the client
          res.json(_.merge(body, userDesign));
        }
      });
    });
    
  } else {
  	// Missing some required attribute
    res.status(400);
    res.json({
      err: 'Missing some required Properties. Must have following: ' + JSON.stringify(REQUIRED_DESIGN_PROPERTIES)
    });
  }

});

// put to update design
router.put('/design/:id', restrict, function (req, res) {
  var id = req.params.id;
  var updatedDesign = req.body;

  // First need to get the user so we can check the design update is for one of the users design (special case for Admin users)
  dbService.users.get(req.session.user, function (err, currentUser) {
    if (err) {
      res.status(404);
      res.json({
        msg: 'Was not able to find User record based on session',
        err: err
      });
    } else {
      dbService.designs.get(id, function(err,currentDesign){
        if (err) {
          res.status(404);
          res.json({
            msg: 'Did not find the matching design, please try again',
            err: err
          });
        // Check that the user isnt updating a design that isnt theres. Only Admin users can do that
        } else if (currentDesign.creator !== currentUser.email && !currentUser.isAdmin) {
          res.status(403);
          res.json({
            msg: 'Can\'t update somebody else\'s design without admin privileges'
          });
        } else {
          // merge properties of new object with old object.
          // Replace missing fields in the new object with the corresponding value in the old object
          // For conflicts, keep the new value
          var updatedDesign = _.defaultsDeep(updatedDesign, currentDesign);
          dbService.designs.insert(updatedDesign, id, function (err, body, header) {
            if (err) {
              res.status(404);
              res.json({
                msg: 'Error occurred while updating design',
                err: err
              });
            } else {
              updatedDesign._rev = body.rev; // attach latest revision number
              res.json(updatedDesign);
            }
          });
        }
      });
    }
  });
});

module.exports = router; // expose the router
