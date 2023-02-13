/**
 * Exposes all necessary variables needed to interact with Cloudant DB
 *
 * Also attaches an important deleteDoc function to each db instance; See comment block below
 */
"use strict";

var _  = require('lodash');
var async = require('async');
//Cloudant Database API
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { BasicAuthenticator } = require('ibm-cloud-sdk-core');

const authenticator = new BasicAuthenticator({
  username: process.env.CLOUDANT_USERNAME,
  password: process.env.CLOUDANT_PASSWORD
});
const service = new CloudantV1({
  authenticator: authenticator
});
  
service.setServiceUrl(process.env.CLOUDANT_URL);


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
// _.forEach(EXPORTED_DBS, db => {
//   db.deleteDoc = function (docID, docRev, cb) {
//     var givenDocID = _.isString(docID) || _.isNumber(docID);
//     var givenDocRev = _.isString(docRev);
//     var givenCallback = _.isFunction(cb);

//     if (givenDocID && givenDocRev && givenCallback) {
//       db.destroy(docID, docRev, cb);
//     } else if (givenCallback) {
//       process.nextTick(() => cb(new Error('Invalid Arguments given to deleteDoc')));
//     } else {
//       throw new Error('Invalid Arguments given to deleteDoc');
//     }
//   }
// });

//find in database
const findDB = async (database,query) => {
    try{
        await service.getDocument({
            db: database,
            docId: query
          }).then(response => {
            return response.result
          }).catch(err=>{
            console.log(err.status)
            return null
          })
    } catch (err){
        console.log(err)
        return null
    } 
}

//find resetLink in database using
const findResetLinkinDB = async (database,query) => {
  try{
      service.postAllDocs({
        db: database
      }).then(response => {
          return response.result.rows.find(x=> x.resetLink === query)
        }).catch(err=>{
          console.log(err.status)
          return null
        })
  } catch (err){
      console.log(err)
      return null
  } 
}

const findwithfunction = async (database,query) => {
  var body, error;
    try{
        await service.getDocument({
            db: database,
            docId: query
          }).then(response => {
            error = null;
            body = response.result
          }).catch(err=>{
           body = null;
           error = err;
          })
    } catch (err){
        body = null;
        error = err;
        console.log(err)
    } 
    return {
      error: error, 
      body: body}
}

const insertwithfunction = async (database,document) => {
  var body, error;
    try{
        await service.postDocument({
          db: database,
          document: document
        }).then(response => {
          error = null;
          body = response.result
        }).catch(err=>{
          body = null;
          error = err;
        })
        
    } catch (err){
        body = null;
        error = err;
        console.log(err)
    } 
    return {
      error: error, 
      body: body}
}

async function findDBfunction(database,userId, f){
  let res = await findwithfunction(database,userId)
  f(res.error, res.body)
}
async function insertDBfunction(database,document, f){
  let res = await insertwithfunction(database,document)
  f(res.error, res.body)
}






// Inserting documet in a database
const insertDB = (database,document) => {
  try{
    service.postDocument({
        db: database,
        document: document
      }).then(response => {
        return response.result
      }).catch(err=>{
        console.log(err.status)
        return null})
  } catch (err){
      console.log(err)
      return null
  } 
}

const listallDocsDB = (database) => {
  try{
    service.postAllDocs({
      db: database,
      includeDocs: true
    }).then(response => {
      return response.result
    }).catch(err=>{
      console.log(err.status)
      return null})
  } catch (err){
      console.log(err)
      return null
  } 
}

const listAllFunctionDB = async (database) => {
  var body, error;
    try{
        await  service.postAllDocs({
          db: database,
          includeDocs: true
        }).then(response => {
            error = null;
            body = response.result
          }).catch(err=>{
           body = null;
           error = err;
          })
    } catch (err){
        body = null;
        error = err;
        console.log(err)
    } 
    return {
      error: error, 
      body: body}
}

async function listAllfunction(database, f){
  res = await listAllFunctionDB(database)
  f(res.error, res.body)
}



const findDesignDB = (database,query) => {
  try{
    service.getDesignDocument({
      db: database,
      ddoc: query,
      }).then(response => {
      return response.result
    }).catch(err=>{
      console.log(err.status)
      return null})
  } catch (err){
      console.log(err)
      return null
  } 
}

async function findDesignfunction(database,design, f){
  res = await findDesignwithfunction(database,design)
  f(res.error, res.body)
}


const findDesignwithfunction = async (database,query) => {
  var body, error;
    try{
        await  service.getDesignDocument({
            db: database,
            ddoc: query,
          }).then(response => {
            error = null;
            body = response.result
          }).catch(err=>{
           body = null;
           error = err;
          })
    } catch (err){
        body = null;
        error = err;
        console.log(err)
    } 
    return {
      error: error, 
      body: body}
}


const insertDesignDB = (database,uniqueID,designDocument) => {
  try{
    service.putDesignDocument({
      db: database,
      designDocument: designDocument,
      ddoc: uniqueID  
    }).then(response => {
      return response.result
    }).catch(err=>{
      console.log(err.status)
      return null})
    } catch (err){
        console.log(err)
        return null
    }  
}

const deleteInDB = (database,id) =>{
  try{
    service.deleteDocument({
      db: database,
      docId: id,
    }).then(response => {
      return response.result
    }).catch(err=>{
      console.log(err.status)
      return null
    })

  } catch (err){
    console.log(err)
    return null
  }
}



module.exports = { findDB,findDesignfunction,deleteInDB, findDesignDB, findResetLinkinDB, insertDB,listAllfunction, findDBfunction,insertDBfunction,listallDocsDB }