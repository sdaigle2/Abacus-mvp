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
var _ = require('lodash');
var orderNumber = require('./server_scripts/services/orderNumber');
var fs = require('fs');
var https = require('https');
var schedule = require('node-schedule');
var backupService = require('./database_backup_util/backup');
var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
var runHttps = process.argv[2] === 'https' ? true : false;

app.use(bodyParser.json({limit: '1mb'}));
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

// Starts the server and returns a promise that resolves to the express app instance that is already alive
function startServer() {
  return orderNumber.initPromise
    .then(function () {
      var port;
      if (runHttps) {
        port = process.env.PORT || 8443;
        var httpsServer = https.createServer(options, app);
      } else {
        port = process.env.PORT || 8080;
      }

      console.log('Server will run on port ' + port);

      var server = runHttps ? httpsServer.listen(port) : app.listen(port);

      return { // return the server & app instances...used for testing
        "app": app,
        "server": server
      };
    })
    .catch(function (err) {
      console.log(`GOT ERROR WHILE INITIALIZING ORDER NUMBER SERVICE: ${JSON.stringify(err, null, 2)}`);
    });
}

if (!module.parent) {
  startServer();
} else {
  // If somebody is require'ing in this script, then just expose the startServer method which will
  // then given them the app & server instances
  // Wrap function with once so that it can only be called once. Subsequent calls get the same return value as the first call
  module.exports = _.once(startServer);
}

var backupJob = schedule.scheduleJob('0 2 * * *', function() {
  backupService.backup();
});
