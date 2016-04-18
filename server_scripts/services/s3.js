/**
 * Exposes an AWS.S3 instance which already has our S3 credentials
 */

const AWS = require('aws-sdk');

AWS.config.AWS_ACCESS_KEY_ID     = process.env.AWS_ACCESS_KEY_ID;
AWS.config.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

module.exports = new AWS.S3(); // export the logged in s3 instance