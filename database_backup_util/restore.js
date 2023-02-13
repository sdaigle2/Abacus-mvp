'use strict';

var aws = require('aws-sdk'),
    fs = require('fs'),
    zlib = require('zlib'),
    childProcess = require('child_process'),
    log4js = require('log4js'),
    cloudant = require('@cloudant/cloudant'),
    logger = log4js.getLogger('Tinker DB restore');

var BUCKET = process.env.BACKUP_BUCKET,
    DB_LOGIN = process.env.BACKUP_DB_LOGIN,
    DB_PASSWORD = process.env.BACKUP_DB_PASSWORD,
    dbnames = ['design', 'users', 'orders', 'order_number', 'discounts'],
    restoreFileDate = process.argv[2],
    _cloudant = new cloudant({account: DB_LOGIN, password: DB_PASSWORD, plugin: 'promises'});

if (!DB_LOGIN || !DB_PASSWORD) {
  logger.error('DB_LOGIN or DB_PASSWORD environment variable is not set');
  process.exit(1);
}

if (!BUCKET) {
  logger.error('Please specify AWS bucket in BACKUP_BUCKET environment variable');
  process.exit(2);
}

if (!restoreFileDate) {
  logger.error('Recovery date not specified');
  process.exit(3);
}

var getBackupFromS3 = function(database) {
  logger.info('Getting backup of ' + database + ' from S3');
  var filename = restoreFileDate + '-' + database + '-backup.json';

  var params = {Bucket: BUCKET, Key: filename};
  var file = require('fs').createWriteStream('backups/' + filename);

  let chunks = [];
  return new Promise((resolve, reject) => {
    new aws.S3().getObject(params).
      on('httpData', function(chunk) { chunks.push(chunk); }).
      on('httpDone', function() {
        var buffer = Buffer.concat(chunks);
        zlib.unzip(buffer, function(err, result) {
          fs.writeFile('backups/' + filename, result, 'utf8');
          logger.info('Download of ' + database + ' finished');
          resolve();
        });
      })
      .send();
  });
};

var prepareDatabase = function(database) {
  var db;
  db = _cloudant.use(database);
  logger.info('Clearing database ' + database);
  return _cloudant.db.destroy(database)
    .then(() => {
      return _cloudant.db.create(database);
    })
    .catch(() => {
      return _cloudant.db.create(database);
    });
};

var restoreToDB = function(database) {
  logger.info('Restoring ' + database + ' backup from local files');

  return new Promise((resolve, reject) => {
    childProcess.exec('bash couchdb-backup.sh  -r -H ' + DB_LOGIN + '.cloudant.com -d ' + database + ' -f backups/' + restoreFileDate + '-' + database + '-backup.json -u ' + DB_LOGIN + ' -p ' + DB_PASSWORD,
    function (err, stdout, stderr) {
      if (err) {
        console.log(stdout);
        console.log(stderr);
        logger.error('Error occuried while reading data from file ' + database + ': ' + err);
        reject(err);
      }

      fs.unlink('backups/' + restoreFileDate + '-' + database + '-backup.json', function(err) {
        if (err) {
          logger.error('Error while deleting ' + filename + ' : ' + err);
          reject(err);
        }
      });
      logger.info('Restoring of ' + database + ' completed successfully');
      resolve();
    });
  });
};

dbnames.reduce((prom, database) => {
  return prom
    .then(() => {
      return getBackupFromS3(database);
    });
}, Promise.resolve())
.then(() => {
  return dbnames.reduce((prom, database) => {
    return prom
      .then(() => {
        return prepareDatabase(database);
      })
  }, Promise.resolve())
})
.then(() => {
  return dbnames.reduce((prom, database) => {
    return prom
      .then(() => {
        return restoreToDB(database);
      })
  }, Promise.resolve());
})
.then(() => {
  logger.info('Restoring done for ' + restoreFileDate);
});
