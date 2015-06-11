/**
 * Created by Dhruv on 6/10/2015.
 */
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/app'));
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/app/index.html');
});
var port = process.env.PORT || 8080;
app.listen(port);
