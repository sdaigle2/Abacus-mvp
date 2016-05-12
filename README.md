# Abacus-mvp

Getting Started:

Check out the project (follow Github instructions)
in the project directory:
(1) npm install
(2) bower install

## Notes on Server Code Structure

The server side code is no longer under one long `server.js` script.
It has now been split up into seperate files inside the `server_scripts` directory.

### server_scripts/routes
This directory holds all the custom server endpoints. Each endpoint is clustered according to their functionality.

For instance, all login,logout,registration, and session endpoints are under `server_scripts/routes/authController.js`.

Each of the files under `server_scripts/routes` expose an instance of an [express.Router()](http://expressjs.com/en/4x/api.html#router). These routers are then all merged into a central router in `server_scripts/routes/index.js` which is then used in the `server.js` script.

To add a new endpoint, either add the endpoint to an existing script in `server_scripts/routes` or create a new controller script under the same directory. If you create a new controller, it will automatically be found by `server_scripts/routes/index.js` and included when the server is launched.

### server_scripts/policies
This directory contains all middleware policies. These are small checks that happen before a request gets sent to its designated request handler. To use them, just import them with `require` wherever you want them to be referenced.

### server_scripts/services
Services are fairly generic. Anytime you want to define a function or expose a variable that needs to be referenced in multiple places, expose it in a file under `server_scripts/services` and then import it with `require` wherever you need it.

## Testing

To run the tests for this project, just run `npm test`

To run just tests for the backend, run `npm run test_backend`
To run just tests for the frontend, run `npm run test_frontend`

Backend tests are written with the [Mocha](https://mochajs.org/) test runner.
In addition to this, the tests also use [supertest](https://github.com/visionmedia/supertest) for interacting with the backend, and [Should](http://shouldjs.github.io) for assertions.
