/**
 * Endpoints for saving and fetching designs by SearchID
 */
"use strict";

var router  = require('express').Router();
var shortid = require('shortid');

// Import services
var dbService = require('../services/db');


var REQUIRED_DESIGN_PROPERTIES = []; // TODO: Fill list with required properties

// fetch design
router.get('/design/:id',function(req,res){
  var id = req.param.id;

  //query the database
  dbService.design.get(id,function(err,body){
    if (err) {
      res.status(404);
      res.json({
        msg: 'Did not find the matching design, please try again',
        err: err
      });
    } else {
      console.log('body:\n' + JSON.stringify(body, null, 2));
      res.json(body); //load the design if id is correct
    }
  });
});

// post design
router.post('/design', function (req, res) {
  var userDesign = req.body;
  // Check that uploaded design has some required properties
  var hasRequiredProps = REQUIRED_DESIGN_PROPERTIES.every(function (property) {
    return property in userDesign;
  });

  if (hasRequiredProps) {
    // Save the design in cloudant
    var id = shortid.generate(); // Should generate a unique id
    dbService.design.insert(userDesign, id, function (err, body, header) {
      if (err) {
        console.log(err);
        res.status(400);
        res.json({err: 'Couldn\'t save design data into databse'});
      } else {
        // design save was a success; send the design info back to the client
        res.json(body);
      }
    });
  } else {
  	// Missing some required attribute
    res.status(400);
    res.json({
      err: 'Missing some required Properties. Must have following: ' + JSON.stringify(REQUIRED_DESIGN_PROPERTIES)
    });
  }

});

module.exports = router; // expose the router
