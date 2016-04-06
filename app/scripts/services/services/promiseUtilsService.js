'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static factory:promiseUtilsService
 * @description
 * # promiseUtilsService
 * Service of the abacuApp
 * 
 * Basic promise utility functions
 */
angular.module('abacuApp')
  .service('PromiseUtils', ['$q', '_', function ($q, _) {
  	return {
  		// Takes any value and returns a promise that has already been resolved to that value
  		resolved: function (val) {
  			var deferred = $q.defer();

  			if (_.isUndefined(val)) {
  				deferred.resolve();
  			} else {
  				deferred.resolve(val);
  			}

  			return deferred.promise;
  		},

  		// Takes any error value and returns a promise that has already been rejected with that error value
  		rejected: function (err) {
  			var deferred = $q.defer();

  			if (_.isUndefined(err)) {
  				deferred.reject();
  			} else {
  				deferred.reject(err);
  			}

  			return deferred.promise;
  		}
  	};
  }]);