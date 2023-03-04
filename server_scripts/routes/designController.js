/**
 * Endpoints for saving and fetching designs by SearchID
 */
"use strict";

const router  = require('express').Router();
const path    = require('path');
const fs      = require('fs');
const shortid = require('shortid');
const _       = require('lodash');

// Import services
const dbService        = require('../services/db');
const generateUniqueID = require('../services/generateUniqueID');
const generatePDF      = require('../services/generatePDF');

// Import policies
const restrict = require('../policies/restrict');

const REQUIRED_DESIGN_PROPERTIES = []; // TODO: Fill list with required properties

// fetch design
router.get('/designs/:id',function(req,res){
  var id = req.params.id;
  //query the database
  dbService.findDBfunction('design',id,function(err,body){
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
router.post('/designs', restrict, function (req, res) {
  var userDesign = req.body;

  // Remove an ID or Revision number that may be attached
  delete userDesign._id;
  delete userDesign._rev;

  // Check that uploaded design has some required properties
  var hasRequiredProps = REQUIRED_DESIGN_PROPERTIES.every(function (property) {
    return property in userDesign;
  });

  if (hasRequiredProps) {
    // Save the design in cloudant
    generateUniqueID('design', function (err, uniqueID) {
      userDesign._id= uniqueID
      dbService.insertDBfunction('design',userDesign, function (err, body, header) {
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
router.put('/designs/:id', restrict, function (req, res) {
  var id = req.params.id;
  var updatedDesign = req.body;

  // First need to get the user so we can check the design update is for one of the users design (special case for Admin users)
  dbService.findDBfunction('users',req.session.user, function (err, currentUser) {
    if (err) {
      res.status(404);
      res.json({
        msg: 'Was not able to find User record based on session',
        err: err
      });
    } else {
      dbService.findDBfunction('design',id, function(err,currentDesign){
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
          updatedDesign = _.defaultsDeep(updatedDesign, currentDesign);
          dbService.insertDBfunction('design',updatedDesign, function (err, body, header) {
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

// The following two routes are for downloading wheelchair PDF files

router.get('/design-drawings/:filename', (req, res) => {
  var filename = req.params.filename;

  if (!_.isString(filename) || (_.isString() && _.isEmpty(filename)) ) {
    res.status(400);
    res.json({err: `Bad filename given: ${filename}`});
    return;
  }

  var absoluteFilePath = path.join(generatePDF.GENERATED_PDFS_DIR, filename);
  res.download(absoluteFilePath, err => {
    if (err) {
      res.status(400);
      res.json(err);
    }

    // Now that the user has downloaded the PDF (or not), delete it to save space
    // Even if the download failed, subsequent tries by the user will result in a new pdf file being created
    fs.unlink(absoluteFilePath, err => {
      if (err)
        console.log(err)
    });
  });

});

// Allows a user to download a PDF for a given design
// Multiple designs can be specified by including them in the request body
router.post('/design-drawings', (req, res) => {
  var designID = req.params.id;

  const getDesignForPDF = cb => {
    if (_.isObject(req.body)) {
      // design was given through request body
      process.nextTick(() => cb(null, req.body));
    } else {
      process.nextTick(() => cb(new Error('No valid design given')));
    }
  };

  getDesignForPDF((err, designs) => {
    if (err) {
      console.log(JSON.stringify(err, null, 2));
      res.status(400);
      return res.json(err);
    }

    designs = _.isArray(designs) ? designs : [designs];
    generatePDF.forWheelchairs(designs, (err, pdfFileInfo) => {
      if (err) {
        console.log(JSON.stringify(err, null, 2));
        res.status(400);
        return res.json(err);
      }

      res.json({
        filename: pdfFileInfo.filename,
        url: `/design-drawings/${pdfFileInfo.filename}` // the path that will allow them to immediately download the file
      });
    });
  });
});

module.exports = router; // expose the router
