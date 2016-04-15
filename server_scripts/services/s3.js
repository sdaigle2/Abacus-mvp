/**
 * Exposes an AWS.S3 instance which already has our bucket credentials
 */

var AWS = require('aws-sdk');

AWS.config.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
AWS.config.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

module.exports = new AWS.S3();