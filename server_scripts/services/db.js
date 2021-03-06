/**
 * Exposes all necessary variables needed to interact with Cloudant DB
 *
 * Also attaches an important deleteDoc function to each db instance; See comment block below
 */
"use strict";

var _  = require('lodash');
var async = require('async');
//Cloudant Database API
var cloudant = require('cloudant')({account: process.env.CLOUDANT_USERNAME, password: process.env.CLOUDANT_PASSWORD,
  plugin:'retry', retryAttempts: 5});

var users     = cloudant.use('users');
var orders    = cloudant.use('orders');
var design    = cloudant.use('design');
var discounts = cloudant.use('discounts');
var orderNumber = cloudant.use('order_number');

// add indexes for users

var email = {name:'email', type:'json', index:{fields:['email']}}
var resetLink = {name:'resetLink', type:'json', index:{fields:['resetLink']}}


function addIndex(index) {
  users.index(index, function(er, response) {
    if (er) {
      throw er;
    } else if (response.result === 'exists') {
      return true
    } else {
      console.log('Created an index for ' + index.name);
    }
  });
}

async.parallel({
  'email': addIndex.bind(this, email),
  'reset': addIndex.bind(this, resetLink)
}, function (err, results) {
  if (err) {
    throw er;
  }
  return
});

const EXPORTED_DBS = {
	users: users,
	orders: orders,
	designs: design,
	discounts: discounts,
	orderNumber: orderNumber
};

/**
 * VERY IMPORTANT
 *
 * Cloudant has done a bad job here of defining the db.destroy function....
 * the db.destroy() function can take either just a callback or a document ID + document revision num + a callback
 * If given docID/docRev then it'll just destroy the single document
 * If given just a callback, then it destroys THE WHOLE DATABASE .... >:[
 * Heres the real nasty part:
 *      If you mean to only destroy a document but the document ID and revision number you give are null/undefined for some reason
 *      Then it has the same functionality as when you only give it a single callback
 *      SO...Even though you meant to only destroy the single document, it ends up destroy the entire database.... great
 *      For this reason, I am attaching a deleteDoc function that does checks on all the arguments before passing them on to
 *      db.destroy() to make sure you don't accidentally destroy the entire DB. Just make sure to use deleteDoc instead of destroy
 *
 * Destroy Docs: https://github.com/apache/couchdb-nano#dbdestroydocname-rev-callback
 */
_.forEach(EXPORTED_DBS, db => {
  db.deleteDoc = function (docID, docRev, cb) {
    var givenDocID = _.isString(docID) || _.isNumber(docID);
    var givenDocRev = _.isString(docRev);
    var givenCallback = _.isFunction(cb);

    if (givenDocID && givenDocRev && givenCallback) {
      db.destroy(docID, docRev, cb);
    } else if (givenCallback) {
      process.nextTick(() => cb(new Error('Invalid Arguments given to deleteDoc')));
    } else {
      throw new Error('Invalid Arguments given to deleteDoc');
    }
  }
});

// Export all db instances along with cloudant instance
module.exports = _.merge(EXPORTED_DBS, {cloudant: cloudant});
