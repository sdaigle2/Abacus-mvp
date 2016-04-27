/**
 * Sets up global variables for all tests under backend_tests/
 * Mainly, sets up the app global variable
 */

var startServer = require('../../server');

server = undefined; // variable is set in the before clause below
app = undefined; // variable is set in the before clause below

before(function (done) {
  this.timeout(10e3); // give the start server some time
  startServer()
    .then(instances => {
      app = instances.app;
      server = instances.server;
      done();
    })
    .catch(done);
});

after(done => {
  server.close();
  done();
});
