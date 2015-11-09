/**
/**
 * Created by Dhruv on 6/10/2015.
 */

//Main API library for all server requests

//HTTP Request Handling
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(require('prerender-node').set('prerenderServiceUrl', 'http://localhost:3000/').set('prerenderToken', 'b0WrJfE13BbRGlHxHaIm'));
////rout handling: detect _escaped_fragment_ then replace it
//app.use(function(req, res, next) {
//  var fragment = req.query._escaped_fragment_;
//
//  // If there is no fragment in the query params
//  // then we're not serving a crawler
//  if (!fragment) return next();
//
//  // If the fragment is empty, serve the
//  // index page
//  if (fragment === "" || fragment === "/")
//    fragment = "/index.html";
//
//  // If fragment does not start with '/'
//  // prepend it to our fragment
//  if (fragment.charAt(0) !== "/")
//    fragment = '/' + fragment;
//
//  // If fragment does not end with '.html'
//  // append it to the fragment
//  if (fragment.indexOf('.html') == -1)
//    fragment += ".html";
//
//  // Serve the static html snapshot
//  try {
//    var file =  + "./app/snapshots" + fragment;
//    res.sendfile(file);
//  } catch (err) {
//    res.send(404);
//  }
//});

//Security
var crypto = require('crypto');
var hash = require('./security').hash;
var check = require('./security').check;
var sanitizeHtml = require('sanitize-html');
var token = crypto.randomBytes(64).toString('hex');

//Data Verification
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

//Sendgrid Email API
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
var email = new sendgrid.Email({
  from: 'tinker@intelliwheels.net',
  subject: 'Tinker Registration'
});

//Stripe Payment API
var stripe = require("stripe")(process.env.STRIPE_TKEY);

//Invoice generation
var genInvoice = require('./pdfGen').generateInvoice;
var genSave = require('./pdfGen').generateSave;

//Block is session cookie does not exist
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.json({'userID': -1});
  }
}

//Initial request to server
app.get('*', function (req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.sendFile('./app/index.html');
});

//LOGIN
app.post('/login', function (req, res) {
  //Retrieve request parameters
  var email = req.body.email;
  var password = req.body.password;

  //Query the database
  users.get(email, function (err, body) { //body is the object we retrieve from the successful query
    if (!err) {
      hash(password, body.salt, function (err, hash) { //hash the password using the stored salt
        if (err)
          res.json({'userID': -1});
        else if (hash === body.password) { //Compare hashed password with stored hash

          //Create a session cookie for the logged in user
          req.session.regenerate(function () {
            req.session.user = body.email;
            delete body.salt;
            delete body.password;
            res.json(body); //Respond with object from database AFTER removing the password hash and salt
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

//LOGOUT
app.post('/logout', restrict, function (req, res) {
  //Destroy session cookie
  req.session.destroy(function () {
    res.send('success');
  });
});

//Check user session on page reload
app.post('/session', restrict, function (req, res) {
  users.get(req.session.user, function (err, body) { //Query the database using the session cookie
    if (!err) {
      delete body.salt;
      delete body.password;
      res.json(body); //Respond with details from database AFTER removing stored hash and salt
    }
    else
      res.json({'userID': -1});
  });
});

//REGISTER
app.post('/register', function (req, res) {
  //Retrieve request parameters that we need, ignoring any others.
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
    confirm: req.body.confirm, //Second typing of password
    unitSys: 0,
    orders: []
  };

  //Check the parameters for validity. check() defined in security.js
  var checkRes = check(data);
  if (checkRes !== true) {
    res.json({err: checkRes});  //If response is not true, it is an error
  }
  else
    users.get(data.email, function (err) { //Query the database for a user with the given email
      if (err) {  //No user exists, we can continue registering

        //Hash the given password. hash() defined in security.js
        hash(data.password, function (err, salt, hash) {
          if (err) throw err;
          // Store the salt and hash in the database
          data.salt = salt;
          data.password = hash;
          delete data.confirm; //Do not want copy of password

          //Insert new user into database
          users.insert(data, data.email, function () {

            //Send an email to the user using the sendgrid API
            email.to = data.email;
            email.text = 'Thank you for registering an account with Abacus.';
            sendgrid.send(email, function () {
              res.json({'success': true});
            });
          });
        });
      }
      else
        res.json({err: 'user already exists', field: 'email'}); //No error in query means the user exists
    });
});

//UPDATE USER INFO
app.post('/update', restrict, function (req, res) {
  //Retrieve request parameters that we need, ignoring any others.
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
    oldPass: req.body.oldPass,
    newPass1: req.body.newPass1,
    newPass2: req.body.newPass2,
    unitSys: 0
  };
  update(data, req.session.user, function (err, body, errNo) { //Main update logic, passing data as new obj and the session cookie as the key
    //CALLBACK
    //Regenerate the session cookie
    req.session.regenerate(function () {
      req.session.user = body.id;
      var message = '';
      //Use the error number to alert the user
      switch(errNo){
        case 1: message = 'New password is not valid';
              break;
        case 2: message = 'Current password is incorrect';
              break;
        case 3: message = 'Password Changed';
              break;
      }
      res.json({'err': err, 'message': message});
    });
  });
});

//Replace any bad request parameters with their existing value in the database
function fixObject(obj, existing){
  if(typeof obj.fName !== 'string' || !obj.fName)
    obj.fName = existing.fName;
  if(typeof obj.lName !== 'string' || !obj.lName)
    obj.lName = existing.lName;
  if(typeof obj.email !== 'string' || !obj.email)
    obj.email = existing.email;
  if(typeof obj.phone !== 'string' || !obj.phone)
    obj.phone = existing.phone;
  if(typeof obj.addr !== 'string' || !obj.addr)
    obj.addr = existing.addr;
  if(typeof obj.addr2 !== 'string' || !obj.addr2)
    obj.addr2 = existing.addr2;
  if(typeof obj.city !== 'string' || !obj.city)
    obj.city = existing.city;
  if(typeof obj.state !== 'string' || !obj.state)
    obj.state = existing.state;
  if(typeof obj.zip !== 'string' || !obj.zip)
    obj.zip = existing.zip;
}

//Update user with email key, with obj
update = function (obj, key, callback) {
  //Query the database for the existing user
  users.get(key, function (error, existing) {

    //Sanitize the obj to be inserted
    fixObject(obj, existing);
    obj._rev = existing._rev; //Copying the revision number is necessary for an update

    //Set the password in the object, may be replaced later
    obj.password = existing.password;
    obj.salt = existing.salt;

    //Make sure the orders are not removed
    obj.orders = existing.orders;
    if (!error) {
      if (!obj.newPass1 || obj.newPass1.length < 8 || obj.newPass1 !== obj.newPass2) { //If the new password doesn't exist, is too short or does not match the confirmation
        console.log('bad newpass');
        //Insert new object without replacing the password
        delete obj.oldPass;
        delete obj.newPass1;
        delete obj.newPass2;
        users.insert(obj, key, function(err, body){
          callback(err, body, 1);
        });
      }
      else
        //Check the old password as we would for login
        hash(obj.oldPass, existing.salt, function (err, oldHash) {
          if (oldHash !== existing.password) { //Hashes do no match
            console.log('wrong pass');
            //Insert new object without replacing the password
            delete obj.oldPass;
            delete obj.newPass1;
            delete obj.newPass2;
            users.insert(obj, key, function(err, body){
              callback(err, body, 2);
            });
          }
          else {
            //Hash the new password with a new salt
            hash(obj.newPass1, function (err, salt, hash) {
              if (err) throw err;
              console.log('password changed');
              // store the new salt & hash in the object and insert
              obj.password = hash;
              obj.salt = salt;
              delete obj.oldPass;
              delete obj.newPass1;
              delete obj.newPass2;
              users.insert(obj, key, function(err, body){
                callback(err, body, 3);
              });
            });
          }
        });
    }
  });
};

//Send a pdf of the given wheelchair to the user
app.post('/save', function (req, res) {
  //Cross check the wheelchair against the JSON, while calculating the total price
  var total = verifyChair(req.body.wheelchair);
  //The wheelchair is valid
  if (total !== false) {
    //Generate a pdf and send it as a blob
    genSave(req.body.wheelchair, res);
  }
  else  //There was an invalid value in the wheelchair object
    res.send('Invalid chair');
});

//Save order to the db, create a stripe payment, and email pdf to the user
app.post('/order', function (req, res) {
  delete req.body.order.orderNum;
  console.log(req.body);

  //This token was created client side by the Stripe API, so we do not need credit card details as part of the request
  var stripeToken = req.body.token;
  console.log(stripeToken);

  //Cross check all wheelchairs in the order against the JSON, while calculating the total price
  var total = verifyOrder(req.body.order, true);
  //The order is valid
  if (total !== false) {
    //Create a new stripe payment
    var charge = stripe.charges.create({
      amount: Math.round(total * 30), // Amount in cents
      currency: "usd",
      source: stripeToken,
      description: "Tinker order"
    }, function (err, charge) {
      //If there was an error and the user didn't opt to pay by insurance
      if (err && req.body.order.payMethod === 'paypal') {
        console.log(err);
        res.json({err: err.type});
      }
      else {  //Successful payment or the user if paying through insurance
        orders.insert(req.body.order, function (err, body) { //Insert the order into the database
          req.body.order.orderNum = body.id;   //Set the id for the order using the id given by the database
          var pdfStream = genInvoice(req.body.order);   //Generate a pdf invoive for the order
          res.send(body.id);

          //Set up the invoice email
          var invoiceEmail = new sendgrid.Email({
            from: 'do-not-reply@abacus.fit',
            subject: 'Abacus Purchase Invoice'
          });

          //Use session cookie to check if user is logged in
          users.get(req.session.user, function(err, existing){
            //If user is logged in, add the order to their entry in the database as well
            if(existing.orders) {
              existing.orders.push(req.body.order);
              users.insert(existing, function (err, body) {
                console.log(err);
              });
            }
          });

          //Send email to the user containing the invoice as a pdf
          invoiceEmail.to = req.body.order.email;
          invoiceEmail.text = 'Thank you for using Abacus to purchase your new Wheelchair. We have attached the invoice for your order.';
          pdfStream.on('finish', function () {
            invoiceEmail.addFile({
              path: 'invoice_' + body.id + '.pdf'
            });
            sendgrid.send(invoiceEmail, function (err, json) {
              console.log(err);
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
