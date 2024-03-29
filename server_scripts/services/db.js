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
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

const authenticator = new IamAuthenticator({
  apikey: process.env.CLOUDANT_APIKEY
});
const service = new CloudantV1({
  authenticator: authenticator
});
  
try{
  service.setServiceUrl(process.env.CLOUDANT_URL)
} catch(err){
  console.log("Database Connection Error",err)
}

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
        return await service.getDocument({
            db: database,
            docId: query
          }).then(response => {
            console.log(response)
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

// async function insertDBfunction(database,document, f){
//   var res = await insertDB(database,document)
//   f(res.error, res.body)
// }

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
  var res = await listAllFunctionDB(database)
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
        error = err.body;
        console.log(err)
    } 
    return {
      error: error, 
      body: body}
}


const insertDesignDB = async (database,uniqueID,designDocument) => {
  try{
    var body, error;
    await service.putDesignDocument({
      db: database,
      designDocument: designDocument,
      ddoc: uniqueID  
    }).then(response => {
      error = null;
      body = response.result
    }).catch(err=>{
      body = null;
      error = err.body;
    })
    } catch (err){
        console.log(err)
        body = null;
        error = err;
    }  
    return {
      error: error, 
      body: body}
}
async function insertDesignDBfunction(database,designDocument,uniqueID, f){
  var res = await insertDesignDB(database,uniqueID,designDocument)
  f(res.error, res.body)
}

const deleteInDB = async (database,id) =>{
  try{
    await service.deleteDocument({
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

const deleteFromDB = async (database,id, rev) =>{
  var body, error;
  try{
    await service.deleteDocument({
      db: database,
      docId: id,
      rev: rev
    }).then(response => {
      body = response.result;
      error = null;
    }).catch(err=>{
      body = null;
      error = err;
    })
  }
    catch (err){
      body = null;
      error = err;
      console.log(err)
  } 
  return {
    error: error, 
    body: body}
}

async function deleteFromDBfunction(database,designDocument,uniqueID, f){
  res = await deleteFromDB(database,uniqueID,designDocument)
  f(res.error, res.body)
}



function mergeObjects(left, right) {
  const result = {};
  
  // add all properties from the right object to the result
  for (let prop in right) {
    if (right.hasOwnProperty(prop)) {
      result[prop] = right[prop];
    }
  }
  
  // add unique properties from the left object to the result
  for (let prop in left) {
    if (left.hasOwnProperty(prop) && !result.hasOwnProperty(prop)) {
      result[prop] = left[prop];
    }
  }
  
  return result;
}




// update document in the datbase 
const inplaceAtomic = async (database,id,updateData,updateField
  ) =>{
  var body, error;
  try{
    await service.getDocument({
      db: database,
      docId: id
    }).then(async response => {
      var document = response.result
      if(updateField === null)
        document = mergeObjects(document, updateData)
      else
        document[updateField] = updateData
      await service.postDocument({
        db: database,
        document: document
      }).then(response => {
        // console.log(response)
        body = response.result.rev;
        error = null;
      }).catch(err=>{
        console.log(err.code, error.result)
        body = null;
        error = err;
      })
    }).catch(err=>{
      body = null;
      error = err;
      console.log(err)
    })
      
  }
    catch (err){
      body = null;
      error = err;
      console.log(err)
  } 
  return {
    error: error, 
    body: body}
}


async function inplaceAtomicFunction(database, uniqueID,updateData,updateField, f){
  console.log("called")
  var  res = await inplaceAtomic(database,uniqueID,updateData,updateField)
  f(res.error, res.body)
}





const bulkFetch = async (database,ids) =>{
  var body, error;
  try{
    var ids_ = []
    for(let i = 0;i<ids.length;i++)
        ids_.push({id: ids[i]})
   await  service.postBulkGet({
      db: database,
      docs: ids_
    }).then(response => {
      body = response.result.results;
      error = null;
    }).catch(err=>{
      console.log(err)
      body = null;
      error = err;
    })
  }
    catch (err){
      body = null;
      error = err;
      console.log(err)
  } 
  return {
    error: error, 
    body: body}
}


async function bulkFetchFunction(database, documentIDs, f){
  var res = await bulkFetch(database,documentIDs)
  f(res.error, res.body)
}



module.exports = { service,inplaceAtomic, findDB, findDesignfunction, deleteInDB, bulkFetchFunction, deleteFromDBfunction, inplaceAtomicFunction, findDesignDB, findResetLinkinDB, insertDB, listAllfunction, findDBfunction,insertDBfunction,listallDocsDB, insertDesignDBfunction }