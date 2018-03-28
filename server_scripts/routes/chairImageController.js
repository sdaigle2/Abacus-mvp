/*
 * This contains all the amazon s3 storage function
 */
const path = require('path');
var router = require('express').Router();
var _      = require('lodash');

//is not current under use
const chairPicRetriever = require('../services/chairPicRetriever');

router.get('/images/chairPic/*',function(req,res){
  const imgURL = req.path;
  const imgKey = imgURL.replace('/images/chairPic/', '');

  const fileName = chairPicRetriever.get(imgKey)
    .then(fileName => {
      res.sendFile(fileName);
    });
});

module.exports = router;
