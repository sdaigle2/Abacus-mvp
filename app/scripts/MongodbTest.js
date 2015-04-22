/**
 * Created by zhoufeng on 4/21/15.
 */
var http = require("http"),
  mongojs = require("mongojs");

var uri = "mongodb://demo_user:demo_password@ds027769.mongolab.com:27769/demo_database",
  db = mongojs.connect(uri, ["demo_collection"]);

var server = http.createServer(requestHandler);
