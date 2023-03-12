const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

const authenticator = new IamAuthenticator({
  apikey: "kNPIxWmtd88Axk2XGz0EPd0IPMwz04hObpooRI3hWHfQ"
});
const service = new CloudantV1({
  authenticator: authenticator
});

const authenticator2 = new IamAuthenticator({
  apikey: "C4XSm11mdnBNZMFUaemcAycjSHKosUFiNPWLgv_08WnR"
});
const service2 = new CloudantV1({
  authenticator: authenticator2
});
  
try{
  service.setServiceUrl("https://c9615d15-7628-4c0a-8e93-155c766f3059-bluemix.cloudantnosqldb.appdomain.cloud/")
  service2.setServiceUrl("https://apikey-v2-qqw0vmlkvpnoc39ly9x4p4r2z3grsztnhltt3e3cad6:192e1bf63ab975c472bebe7ba77b01c8@4a32ed25-b7eb-4265-b5e2-1568992df9ee-bluemix.cloudant.com")
} catch(err){
  console.log("Database COnnection Error",err)
}

// service2.postDesignDocs({
//   attachments: true,
//   db: 'users'
// }).then(response => { response.result.rows.map(async x=>{
//   let id = x.id
//   id = id.slice(8, id.length)

//   await service.putDesignDocument({
//     db: 'users',
//     designDocument: x,
//     ddoc: id
//   }).then(response => {
//     console.log(response.result);
//   })
// })
  
// });

// service2.postAllDocs({
//   db: 'users',
//   includeDocs: true,
// }).then(response => {
//   response.result.rows.map(async x=>{
//     console.log(x)
//     await service.putDocument({
//       db: 'users',
//       docId: x.id,
//       document: x
//     }).then(res => {
//       console.log(res.result);
//     })
//   })
// });


//insert into database
const findDB = async (database,query) => {
  var body, error;
    try{
        await service.getDocument({
            db: database,
            docId: query
          }).then(response => {
            console.log(response.result)
          }).catch(err=>{
            console.log(err.status)
          })
    } catch (err){
        body = null;
        error = err;
        console.log(err)
    } 
}
findDB('users','sdaigle2@gmail.com')
// findDB('users','ddoc:abcd')


const listallDocsDB = (database) => {
  try{
    service.postAllDocs({
      db: database,
      includeDocs: true
    }).then(response => {
      var data = response.result.rows
      console.log(data)

    }).catch(err=>console.log(err))
  } catch (err){
      console.log(err)
  } 
}
// listallDocsDB('design')

async function getPassCode(){
  var passwordCode ='0648f6135a2888eea1a6178a79bd86d7';
  try{
    await service.getDocument({
        db: 'users',
        docId:{resetLink: passwordCode}
      }).then(response => {
        return response.result
      }).catch(err=>{
        console.log(err)
      })
  } catch (err){
    body = null;
    error = err;
    console.log(err)
  } 
  
}
// getPassCode()






const bulkFetch = (database,ids) =>{
  var body, error;
  try{
    service.postBulkGet({
      db: database,
      docs: ids
    }).then(response => {
      console.log(response.result)
      body = response.result;
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
  res = await bulkFetch(database,documentIDs)
  f(res.error, res.body)
}


// bulkFetchFunction('users',['dtintinapon@hotmail.com','drjremax@verizon.net','dpfitnsports@gmail.com','donsantoso@gmail.com'], ()=>{})
// bulkFetchFunction('design',[], ()=>{})





const insertwithfunction = async (database,document) => {
  var body, error;
    try{
        await service.postDocument({
          db: database,
          document: document
        }).then(response => {
          console.log(response.result)
        }).catch(err=>{
          console.log(err);
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


// insertwithfunction('users',{"data":"test"})



const deleteFromDB = (database,id, rev) =>{
  var body, error;
  try{
    service.deleteDocument({
      db: database,
      docId: id,
      rev: rev
    }).then(response => {
      console.log(response.result)
      body = response.result;
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


const findDesignDB = (database) => {
  try{
    service.postDesignDocs({
      attachments: true,
      db: 'users'
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
// findDesignDB()

// findDB('users','hira141998@gmail.com')
// deleteFromDB('users','barbie000172@gmail.com','1-cb62a4207bdd4443b39f5e751ef0ef6f')
// deleteFromDB('users','hira141998@gmail.com','1-3f6f801b14ed3d5ef3fbcca965cea70f')
// deleteFromDB('users','asd@mail.com','1-3f6f801b14ed3d5ef3fbcca965cea70f')
