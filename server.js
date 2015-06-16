/**
 * Created by Dhruv on 6/10/2015.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var me = 'intelliwheels';
var password = 'Wheelchair34';
var cloudant = require('cloudant')({account: me, password: password});
var nodemailer = require('nodemailer');

var users = cloudant.use('abacus');
var _rev;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('*', function (req, res) {
  response.writeHead(200, {"Content-Type": "text/html"});
  res.sendFile('./app/index.html');
});

app.post('/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  users.get(email, function (err, body) {
    if (!err) {
      if (body.password === req.body.password) {
        _rev = body.rev;
        res.json(body);
      }
      else
        res.json({'userID': -1});
    }
    else
      res.json({'userID': -1});
  });
});

app.post('/register', function (req, res) {
  var email = req.body.email;
  users.get(email, function (err, body) {
    if (err) {
      users.insert(req.body, email);
      res.json({'success': true});
    }
    else
      res.json({'success': false});
  });
});

app.post('/update', function (req, res) {
  update(req.body, req.body.email, function (err, body) {
    res.json({'success': err});
  });
});

update = function (obj, key, callback) {
  users.get(key, function (error, existing) {
    if (!error) {
      obj._rev = existing._rev;
      obj.password = existing.password;
    }
    users.insert(obj, key, callback);
  });
};

app.listen(8080);
