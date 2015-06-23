/**
 * Created by Dhruv on 6/10/2015.
 */

//HTTP Request Handling
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({
  extended: true
}));

//Security
var crypto = require('crypto');
var hash = require('./security').hash;
var check = require('./security').check;
var sanitizeHtml = require('sanitize-html');
var sProperties = {
  allowedTags: []
};
var token = crypto.randomBytes(64).toString('hex');

//Session Management
var session = require('express-session');

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: token
}));

//Cloudant Database API
var cloudant = require('cloudant')({account: process.env.CLOUDANT_USERNAME, password: process.env.CLOUDANT_PASSWORD});
var users = cloudant.use('users');
var orders = cloudant.use('orders');


//HTML to pdf
var fs = require('fs');
var pdf = require('wkhtmltopdf');
pdf.command = 'c:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe';

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.json({'userID': -1});
  }
}

app.get('*', function (req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.sendFile('./app/index.html');
});

//Check user session on page reload
app.post('/session', restrict, function (req, res) {
  users.get(req.session.user, function (err, body) {
    if (!err) {
      delete body.salt;
      delete body.password;
      res.json(body);
    }
    else
      res.json({'userID': -1});
  });
});

//LOGIN
app.post('/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  users.get(email, function (err, body) {
    if (!err) {
      hash(password, body.salt, function (err, hash) {
        if (err)
          res.json({'userID': -1});
        else if (hash === body.password) {
          req.session.regenerate(function () {
            req.session.user = body.email;
            delete body.salt;
            delete body.password;
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

app.post('/logout', restrict, function(req, res){
  req.session.destroy(function(){
    res.send('success');
  });
});

app.post('/register', function (req, res) {
  var data = {
    fName: (req.body.fName, sProperties),
    lName: (req.body.lName, sProperties),
    email: (req.body.email, sProperties),
    phone: (req.body.phone, sProperties),
    addr: (req.body.addr, sProperties),
    addr2: (req.body.addr2, sProperties),
    city: (req.body.city, sProperties),
    state: (req.body.state, sProperties),
    zip: (req.body.zip, sProperties),
    password: (req.body.password, sProperties)
  };
  if(!check(data)){
    res.json({err:'evil input'});
  }
  else
  if(req.body.password !== req.body.confirm){
    res.json({err: 'passwords do not match'});
  }
  else
  users.get(data.email, function (err) {
    if (err) {
      hash(data.password, function (err, salt, hash) {
        if (err) throw err;
        // store the salt & hash in the "db"
        data.salt = salt;
        data.password = hash;
        users.insert(data, data.email);
        res.json({'success': true});
      });
    }
    else
      res.json({err: 'user already exists'});
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
      obj.password = existing.password;
      obj.salt = existing.salt;
      users.insert(obj, key, callback);
    }
  });
};

app.post('/order', function(req, res){
  delete req.body.order.orderNum;
  var html = req.body.page;

  orders.insert(req.body.order, function (err, body){
    //pdf(html, { pageSize: 'letter', output:'out.pdf'});

    res.send(body.id);
  });
});

var port = process.env.PORT || 8080;
app.listen(port);
