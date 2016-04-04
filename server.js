/**
 * Created by Dhruv on 6/10/2015.
 */

// Main API library for all server requests

// HTTP Request Handling
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var shortid = require('shortid');
var path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(require('prerender-node').set('prerenderToken', 'b0WrJfE13BbRGlHxHaIm'));

//Security
var crypto = require('crypto');
var token = crypto.randomBytes(64).toString('hex');

//Session Management
var session = require('express-session');

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: token
}));

// mainRouter contains all custom endpoints in controllers from server_scripts/routes
var mainRouter = require('./server_scripts/routes');
app.use(mainRouter);
app.use(express.static(__dirname + '/app'));
//Initial request to server
app.get('/', function (req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.sendFile('./app/index.html', {root:__dirname});
});



var port = process.env.PORT || 8080;

console.log('Server will run on port ' + port);

app.listen(port);
