'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static service:localJSONStorage
 * @description
 * # localJSONStorage
 * This service is meant to mimic the API for $cookieStore
 * The only difference is, instead of persisting items through cookies, items are serialized into JSON and then
 * persisted onto localStorage
 *
 * If the browser doesn't support localStorage, then $cookieStore is used in its place
 *
 * documentation of $cookieStore: https://docs.angularjs.org/api/ngCookies/service/$cookieStore
 * info on localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 */
angular.module('abacuApp')
  .service('localJSONStorage', ['$cookieStore', '_', function ($cookieStore, _) {
    if (false) {
      return $cookieStore; // fallback to $cookieStore...has same get,put,remove methods as localJSONStorage
    }

  	var localJSONStorage = function () {
  		localJSONStorage.prototype.get = function(key) {
  			var jsonVal = localStorage.getItem(key);
  			return JSON.parse(jsonVal);
  		};

  		localJSONStorage.prototype.put = function(key, val) {
  			var jsonVal = JSON.stringify(val);
  			localStorage.setItem(key, jsonVal);
  		};

  		localJSONStorage.prototype.remove = function(key) {
  			localStorage.removeItem(key);
  		};
  	};

  	return new localJSONStorage();
  }]);
