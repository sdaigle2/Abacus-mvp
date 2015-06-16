/**
 * Created by Dhruv on 6/10/2015.
 */
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var session = require('express-session');

var me = 'intelliwheels';
var password = 'Wheelchair34';
var cloudant = require('cloudant')({account: me, password: password});

var nodemailer = require('nodemailer');
var hash = require('./pass').hash;


var users = cloudant.use('abacus');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'W828Y4OOX19nY>a]}M<D,4W|{5S,9/'
}));

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.json('Authentication Failed');
  }
}

app.get('*', function (req, res) {
  response.writeHead(200, {"Content-Type": "text/html"});
  res.sendFile('./app/index.html');
});


app.post('/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  users.get(email, function (err, body) {
    if (!err) {
      hash(password, body.salt, function (err, hash) {
        if (err)
          res.json({'userID': -1});
        else
        if (hash === body.password) {
          req.session.regenerate(function(){
            req.session.user = body.email;
            res.json(body);
          });
        }
        else
          res.json({'userID': -1});
      });
    }
    else
      res.json({'userID': -1});
  });
});

app.post('/register', function (req, res) {
  var email = req.body.email;
  users.get(email, function (err, body) {
    if (err) {
      hash(req.body.password, function (err, salt, hash) {
        if (err) throw err;
        // store the salt & hash in the "db"
        req.body.salt = salt;
        req.body.password = hash;
        users.insert(req.body, email);
        res.json({'success': true});
      });
    }
    else
      res.json({'success': false});
  });
});

app.post('/update', restrict, function (req, res) {
  update(req.body, req.session.user, function (err, body) {
    res.json({'success': err});
  });
});

update = function (obj, key, password, callback) {
  users.get(key, function (error, existing) {
    if (!error) {
      obj._rev = existing._rev;
      users.insert(obj, key, callback);
    }
  });
};

app.listen(8080);
