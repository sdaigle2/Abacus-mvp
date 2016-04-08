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
  .factory('Errors', ['_', function (_) {
  	// createErrorType function is from here: http://stackoverflow.com/a/27925672/2130247
  	function createErrorType(name, init) {
		function E(message) {
			if (!Error.captureStackTrace) {
				this.stack = (new Error()).stack;
			} else {
				Error.captureStackTrace(this, this.constructor);
				this.message = message || '';
				init = init || _.noop; // init arg is optional
				init.apply(this, arguments);
			}
		}

		E.prototype = new Error();
		E.prototype.name = name;
		E.prototype.constructor = E;

		return E;
	}

	// Add to this object to create more error types
  	return {
		'NotLoggedInError': createErrorType("NotLoggedInError"),
		'IncorrectLoginError': createErrorType("IncorrectLoginError"),
		'CantAddDiscountError': createErrorType("CantAddDiscountError"),
		'CantCombineDiscountError': createErrorType("CantCombineDiscountError"),
		'ExpiredDiscountError': createErrorType("ExpiredDiscountError")
  	};
  }]);