'use strict';

/*
* This Factory exposes an object with constructors for various Error types
* Useful for easily resolving what went wrong when an error is received.
* For example, you can just do `err instanceof Errors.NotLoggedInError` to see if
* the error was raised because the user wasnt logged in for some action
* 
* Currently, error types are: NotLoggedInError, IncorrectLoginError
*/


angular.module('abacuApp')
  .controller('SaveDesignMethodCtrl', ['$scope', function ($scope) {

  }]);