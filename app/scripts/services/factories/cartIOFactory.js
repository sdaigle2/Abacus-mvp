'use strict';

/**
 * @ngdoc function
 * @name abacuApp.serives:userService
 * @description
 * # userService
 * Service of the abacuApp
 * Abstracts where the cart items come from based on whether the user is logged in or not.
 * Constructor must be given a user object
 */

/*
 *
 */
angular.module('abacuApp')
  .factory('CartIO',['Wheelchair', '$http', '$cookieStore', '$q',
  	function (Wheelchair, $http, $cookieStore, $q) {
  		var CartIO = function (user) {
  			this.user = user;
  			this.wheelchairs = null; // initial value

  			// returns promise to all current cart wheelchairs
  			CartIO.prototype.getWheelchairs = function () {
  				var instance = this;

  				if (this.wheelchairs !== null) {
  					return $q(function (resolve) {
  						resolve(instance.wheelchairs);
  					});
  				}

  				// get it from the source
  				if (this.user.isLoggedIn()) {
  					// get cart from db
  					$http.get('/session')
  					.then(function (user) {
  						instance.wheelchairs = user.cart;
  						return user.cart;
  					});
  				} else {
					this.wheelchairs = [];
					var cartIndex = 0;
					var cartWheelchair = null;
					while (cartWheelchair = $cookieStore.get('wheelchair' + cartIndex)){
						this.wheelchairs.push(new Wheelchair(cartWheelchair)));
						cartIndex++;
					}

					return $q(function (resolve) {
						resolve(instance.wheelchairs);
					});
  				}
  			};

  			CartIO.prototype.addWheelchair = function(wheelchair) {
  				var instance = this;
  				return this.getWheelchairs()
  				.then(function (wheelchairs) {
  					instance.wheelchairs = wheelchairs;
  					instance.wheelchairs.push(wheelchair);

  					if (instance.user.isLoggedIn()) {
  						// the user is logged in so save it to their account in the db
  						return instance.user.updateDB();
  					} else {
  						var cartIdx = instance.wheelchairs.length - 1;
  						return $cookieStore('wheelchair' + cartIdx, wheelchair.getAll());
  					}
  				})
  			};
  		};
  	}]);