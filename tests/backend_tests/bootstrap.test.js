/**
 * Sets up global variables for all tests under backend_tests/
 * Mainly, sets up the app global variable
 */

var startServer = require('../../server');

var app; // variable is set in the before clause below

before(done => {
  startServer()
    .then(appInstance => {
      app = appInstance;
      done();
    })
    .catch(done);
});

after(done => {
  app.close();
  done();
});
