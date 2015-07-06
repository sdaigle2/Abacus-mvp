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
var tempUser = cloudant.use('temp');

//Email
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
var email = new sendgrid.Email({
  from: 'do-not-reply@abacus.fit',
  subject: 'Abacus Registration'
});

//Payment
var stripe = require("stripe")(process.env.STRIPE_TKEY);

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

app.post('/logout', restrict, function (req, res) {
  req.session.destroy(function () {
    res.send('success');
  });
});

app.post('/register', function (req, res) {
  var data = {
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    phone: req.body.phone,
    addr: req.body.addr,
    addr2: req.body.addr2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    password: req.body.password,
    unitSys: 0,
    orders: []
  };
  if (!check(data)) {
    res.json({err: 'evil input'});
  }
  else if (req.body.password.length < 8) {
    res.json({err: 'password should have at least 8 characters', field:'password'});
  }
  else if (req.body.password !== req.body.confirm) {
    res.json({err: 'passwords do not match', field:'password'});
  }
  else
  users.get(data.email, function (err) {
    if (err) {
      hash(data.password, function (err, salt, hash) {
        if (err) throw err;
        // store the salt & hash in the "db"
        data.salt = salt;
        data.password = hash;
        users.insert(data, data.email, function (err, body) {
          email.to = data.email;
          email.text = 'Thank you for registering an account with Abacus.';
          sendgrid.send(email, function (err, json) {
            res.json({'success': true});
          });
        });
      });
    }
      else
        res.json({err: 'user already exists', field: 'email'});
    });
});

app.post('/confirm', function (req, res) {
  var id = req.body.id;
  console.log(id);
  tempUser.get(id, function (err, body) {
    if (err) {
      res.json(err);
    }
    else {
      var rev = body._rev;
      var email = body.email;
      delete body._id;
      delete body._rev;
      users.insert(body, body.email, function (err, body) {
        if (err) {
          res.json(err);
        }
        else
          tempUser.destroy(id, rev, function (err) {
            tempUser.get(email, function (err, body) {
              tempUser.destroy(email, body._rev, function (err) {
                res.json("Success");
              });
            });
          });
      });
    }
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

app.post('/order', function (req, res) {
  delete req.body.order.orderNum;
  console.log(req.body);

  var stripeToken = req.body.token;
  console.log(stripeToken);
  console.log(Math.round(req.body.order.total * 100));

  var charge = stripe.charges.create({
    amount: Math.round(req.body.order.total * 100), // amount in cents, again
    currency: "usd",
    source: stripeToken,
    description: "Example charge"
  }, function(err, charge) {
    if (err) {
      res.json({err: err.type});
    }
    else

      orders.insert(req.body.order, function (err, body) {
        res.send(body.id);
      });

  });
});

var port = process.env.PORT || 8080;
app.listen(port);
