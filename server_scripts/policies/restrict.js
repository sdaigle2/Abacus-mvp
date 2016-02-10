/**
 * Checks if request has a session attached to it
 * If it does, lets the request through to the next request handler,
 * Otherwise, will send a bad response
 */
 "use strict";

 // Block if session cookie does not exist
module.exports = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.json({'userID': -1});
  }
};