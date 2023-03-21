var aws = require('aws-sdk'),
    fs = require('fs'),
    zlib = require('zlib'),
    childProcess = require('child_process'),
    log4js = require('log4js'),
    cloudant = require('@cloudant/cloudant'),
    logger = log4js.getLogger('Tinker user restore');

var BUCKET = process.env.BACKUP_BUCKET,
    DB_LOGIN = process.env.BACKUP_DB_LOGIN,
    DB_PASSWORD = process.env.BACKUP_DB_PASSWORD,
    restoreFileDate = process.argv[2],
    userId = process.argv[3];

if (!DB_LOGIN || !DB_PASSWORD) {
  logger.error('DB_LOGIN or DB_PASSWORD environment variable is not set');
  process.exit(1);
}

if (!BUCKET) {
  logger.error('Please specify AWS bucket in BACKUP_BUCKET environment variable');
  process.exit(2);
}

if (!restoreFileDate) {
  logger.error('Restore date is not specified');
  process.exit(3);
}

if (!userId) {
  logger.error('User\'s id not specified');
  process.exit(4);
}

var getFilesFromS3 = function() {
  logger.info('Getting backup of users from S3');
  return new Promise((resolve, reject) => {
    var filename = restoreFileDate + '-users-backup.json';

    var params = {Bucket: BUCKET, Key: filename};
    var file = require('fs').createWriteStream('backups/' + filename);
    let chunks = [];
    new aws.S3().getObject(params).
      on('httpData', function(chunk) { chunks.push(chunk); }).
      on('httpDone', function() {
        var buffer = Buffer.concat(chunks);
        zlib.unzip(buffer, function(err, result) {
          fs.writeFile('backups/' + restoreFileDate + '-users-backup.json', result, 'utf8');
          logger.info('Download of users finished');

          logger.info('Getting backup of orders from S3');
          var filename = restoreFileDate + '-orders-backup.json';

          var params = {Bucket: BUCKET, Key: filename};
          var file = require('fs').createWriteStream('backups/' + filename);

          let chunks = [];
          new aws.S3().getObject(params).
          on('httpData', function(chunk) { chunks.push(chunk); }).
          on('httpDone', function() {
            var buffer = Buffer.concat(chunks);
            zlib.unzip(buffer, function(err, result) {
              fs.writeFile('backups/' + filename, result, 'utf8');
              logger.info('Download of orders finished');
              resolve();
            });
          }).
          send();
        });
      }).
      send();
  });
};

var findUserDocument = function(userId) {
  return new Promise((resolve, reject) => {
    fs.readFile('backups/' + restoreFileDate + '-users-backup.json', (err, data) => {
      if (err) {
        logger.error('Error reading backup file: ' + err);
      }
      backupDocument = JSON.parse(data);
      userDocument = backupDocument.docs.filter((document) => {
        return document._id === userId;
      })[0];

      if (userDocument.length === 0) {
        logger.error('Cannot find user with this id');
        process.exit(3);
      }

      delete userDocument._rev;
      resolve(userDocument);
    });
  });
};

var findUserOrders = function(userId) {
  return new Promise((resolve, reject) => {
    fs.readFile('backups/' + restoreFileDate + '-orders-backup.json', (err, data) => {
      if (err) {
        logger.error('Error reading backup file: ' + err);
        reject(err);
      }
      backupDocument = JSON.parse(data);
      var orders = backupDocument.docs.filter((document) => {
        return document.userID === userId;
      });

      orders = orders.map((order) => {
        delete order._rev;
        return order;
      });

      if (orders.length === 0) {
        logger.warn('User id ' + userId + ' doesn\'t have orders');
      }

      resolve(orders);
    });
  });
};

var writeToDB = function(userToRestore, orders) {
  logger.info('Writing data to DB');
  let _cloudant = new cloudant({account: DB_LOGIN, password: DB_PASSWORD, plugin: 'promises'}),
  db = _cloudant.use('users');

  //insert user document
  var updateUser = function () {
    var db = _cloudant.use('users');
    return db.get(userId)
    .then((user) => {
      logger.warn('User id ' + userId + ' exists in database. Deleting');
      return db.destroy(userId, user._rev);
    })
    .then(() => {
      return db.insert(userToRestore);
    })
    .catch((err) => {
      if (err.error === 'not_found') {
        return db.insert(userToRestore)
        .then((result) => {
          console.log('result', result);
        })
        .catch((err) => {
          return Promise.reject(err);
        })
      }
    });
  };

  var updateOrders = function () {
    var db = _cloudant.use('orders');
    if (orders.length > 0) {
      return orders.reduce((prom, order, index, array) => {
        return prom
          .then(() => {
            return db.get(order._id);
          })
          .then((orderInDB) => {
            return db.destroy(orderInDB._id, orderInDB._rev);
          })
          .then(() => {
            return db.insert(order);
          })
          .then(() => {
            logger.info('Restoring orders - ' + Math.round(index/array.length*100) + '%');
          })
          .catch((err) => {
            if (err.error === 'not_found') {
              return db.insert(order)
                .then(() => {
                  logger.info('Restoring orders - ' + Math.round(index/array.length*100) + '%');
                })
                .catch((errNew) => {
                  return Promise.reject(errNew);
                })
            }
          });
      }, Promise.resolve());
    }
    return Promise.resolve();
  }

  return updateUser()
    .then(() => {
      return updateOrders();
    });
}

var userToRestore;
getFilesFromS3()
  .then(() => {
    return findUserDocument(userId);
  })
  .then((user) => {
    userToRestore = user;
    return findUserOrders(userId);
  })
  .then((userOrders) => {
    return writeToDB(userToRestore, userOrders);
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      fs.unlink('backups/' + restoreFileDate + '-users-backup.json', function(err) {
        if (err) {
          logger.error('Error while deleting backups/' + restoreFileDate + '-users-backup.json : ' + err);
          reject(err);
        }
        fs.unlink('backups/' + restoreFileDate + '-orders-backup.json', function(err) {
          if (err) {
            logger.error('Error while deleting backups/' + restoreFileDate + '-orders-backup.json : ' + err);
            reject(err);
          }
          resolve();
        });
      });
    });
  })
  .then(() => {
    logger.info('User id ' + userId + ' updated successfully');
  })
  .catch((err) => {
    logger.error('Failed updating user id ' + userId + ' ' + err);
  })
