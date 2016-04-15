/*
 * This contains all the amazon s3 storage function
 */

var router = require('express').Router();

const s3 = require('../services/s3');

router.get('/images/chairPic/*',function(req,res){
  var imgURL = req.path;
  var params = {Bucket: 'tinkerwheelchair', Key: imgURL.replace('/images/chairPic/', '')};
  s3.getObject(params).createReadStream()
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

module.exports = router;
