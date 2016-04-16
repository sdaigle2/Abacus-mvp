/*
 * This contains all the amazon s3 storage function
 */

var router = require('express').Router();

const chairPicRetriever = require('../services/chairPicRetriever');

router.get('/images/chairPic/*',function(req,res){
  var imgURL = req.path;
  var imgKey = imgURL.replace('/images/chairPic/', '');

  chairPicRetriever.get(imgKey)
  .then(imageStream => {
    imageStream
    .on('error', function(e){
      console.log(e);
      res.status(404);
      res.send('Not found')
    })
    .pipe(res)
    .on('error', function(e){
      console.log(e);
      res.status(404);
      res.send('Not found')
    });
  });
});

module.exports = router;
