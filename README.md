# Abacus-mvp

Getting Started:

Check out the project (follow Github instructions)
in the project directory:
(1) npm install
(2) bower install
(3) set environment variables (Ask scott for the variables)
    a) AWS
    b) Cloudant
    c) SendGrid
    d) Stripe
(4) ways to run
    a) **node server.js** //this runs the whole app at localhost:8080 and it connects to all of the databases. It communicates with the server with http. Use this most of the time.  The only thing that you can't do with this is test stripe because it's an unsecure library.
    b) **node server.js https** //this runs the whole app at https://localhost:8443 and it connects to all of the databases.  It communicates with the server with https so it's good for testing stripe.  The only problem is that it uses a self-signed certificate so looks sketchy.
    c) **grunt serve** //if you don't have an internet connection and are only doing front end bugs, this is the way to go.  The system won't connect to any databases or anything remote.

## Notes on Cloudant Database
We have two databases.  The real database is called intelliwheels.  The database for testing is called intelliwheels-testing.  If you want to use the testing database, you will have to uncomment line 22 of userController.js

## Notes on general library used
loadash (with the symbol _.) is used for array, and object manipulation. details see:https://lodash.com/

## Notes on frontend docs
docs are available in the docs folder

## Notes on Server Code Structure

ECMAScript 6 are being used here like '=>' make sure to turn on ECMAScript 6 interpreter in your IDE. Otherwise it will be considered as syntax error.
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
