/*
 * This contains all the amazon s3 storage function
 */

var router = require('express').Router();
var AWS = require('aws-sdk');
AWS.config.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
AWS.config.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

var s3 = new AWS.S3();

//s3.listBuckets(function(err, data){
//  if(err){console.log("Error", err)}
//  else{
//    for (var index in data.Buckets){
//      var bucket = data.Buckets[index];
//      console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
//    }
//  }
//});


module.exports = router;
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

