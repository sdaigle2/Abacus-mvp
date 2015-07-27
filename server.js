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
var token = crypto.randomBytes(64).toString('hex');
var verifyOrder = require('./data').verifyOrder;
var verifyChair = require('./data').verifyWheelchair;

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

var genInvoice = require('./pdfGen').generateInvoice;
var genSave = require('./pdfGen').generateSave;

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
    confirm: req.body.confirm,
    unitSys: 0,
    orders: []
  };
  var err = check(data);
  if (err !== true) {
    res.json({err: err});
  }
  else
    users.get(data.email, function (err) {
      if (err) {
        hash(data.password, function (err, salt, hash) {
          if (err) throw err;
          // store the salt & hash in the "db"
          data.salt = salt;
          data.password = hash;
          delete data.confirm;
          users.insert(data, data.email, function () {
            email.to = data.email;
            email.text = 'Thank you for registering an account with Abacus.';
            sendgrid.send(email, function () {
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
    req.session.regenerate(function () {
      req.session.user = body.id;
      res.json({'success': err});
    });
  });
});

update = function (obj, key, callback) {
  delete obj.wheelchairs;
  users.get(key, function (error, existing) {
    obj._rev = existing._rev;
    obj.password = existing.password;
    obj.salt = existing.salt;
    if (!error) {
      if (!obj.newPass1 || obj.newPass1.length < 8 || obj.newPass1 !== obj.newPass2) {
        console.log('bad newpass');
        delete obj.oldPass;
        delete obj.newPass1;
        delete obj.newPass2;
        users.insert(obj, key, callback);
      }
      else
        hash(obj.oldPass, existing.salt, function (err, oldHash) {
          if (oldHash !== existing.password) {
            console.log('wrong pass');
            delete obj.oldPass;
            delete obj.newPass1;
            delete obj.newPass2;
            users.insert(obj, key, callback);
          }
          else {
            hash(obj.newPass1, function (err, salt, hash) {
              if (err) throw err;
              // store the salt & hash in the "db"
              console.log('password changed');
              obj.password = hash;
              obj.salt = salt;
              delete obj.oldPass;
              delete obj.newPass1;
              delete obj.newPass2;
              users.insert(obj, key, callback);
            });
          }
        });
    }
  });
};

app.post('/save', function (req, res) {

  var total = verifyChair(req.body.wheelchair);
  if (total !== false) {
    res.download('mus_reading.pdf');
    //genSave(req.body.wheelchair, res);
    //res.send('huza');
  }
  else
    res.send('Invalid chair');
});

app.post('/order', function (req, res) {
  delete req.body.order.orderNum;
  console.log(req.body);

  var stripeToken = req.body.token;
  console.log(stripeToken);

  var total = verifyOrder(req.body.order, true);
  if (total !== false) {
    var charge = stripe.charges.create({
      amount: Math.round(total * 100), // amount in cents, again
      currency: "usd",
      source: stripeToken,
      description: "Example charge"
    }, function (err, charge) {
      if (err && req.body.order.payMethod === 'paypal') {
        console.log(err);
        res.json({err: err.type});
      }
      else {
        orders.insert(req.body.order, function (err, body) {
          req.body.order.orderNum = body.id;
          var pdfStream = genInvoice(req.body.order);
          var invoiceEmail = new sendgrid.Email({
            from: 'do-not-reply@abacus.fit',
            subject: 'Abacus Purchase Invoice'
          });
          invoiceEmail.to = req.body.order.email;
          invoiceEmail.text = 'Thank you for using Abacus to purchase your new Wheelchair. We have attached the invoice for your order.';
          pdfStream.on('finish', function () {
            invoiceEmail.addFile({
              path: 'invoice_' + body.id + '.pdf'
            });
            sendgrid.send(invoiceEmail, function (err, json) {
              console.log(err);
              res.send(body.id);
            });
          });
        });
      }
    });
  }
  else
    res.send({err: 'Invalid order'});
});

var port = process.env.PORT || 8080;
app.listen(port);
