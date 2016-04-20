'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static factory:compareDesigns
 * @description
 * # compareDesigns
 * Service of the abacuApp
 *
 * Used to store designs that the user selects for comparisons
 * Selection designs are stored using localJSONStorage which internally uses localStorage with a fallback to $cookieStore
 * Must keep in mind that there is a limit to how many designs can be stored with the service (specified by the 'MAX_COMPARISON_CHAIRS' constant)
 * You can check whether any more designs can be stored using `ComparedDesigns.isFull()`
 *
 * The service as a whole consists of two instances of `ComparedDesignsStorage`.
 * One is for the cart, and another is for MyDesigns so that comparisons between cart chairs and myDesigns chairs can be made independently
 * You can access each ComparedDesignsStorage with ComparedDesigns.cart & ComparedDesigns.myDesigns
 */
angular.module('abacuApp')
  .constant('LOCAL_CART_COMPARED_DESIGNS_KEY', 'cartComparedDesigns')
  .constant('LOCAL_MYDESIGNS_COMPARED_DESIGNS_KEY', 'myDesignComparedDesigns')
  .constant('MAX_COMPARISON_CHAIRS', 3)
  .service('ComparedDesigns', ['localJSONStorage', 'Design', 'LOCAL_CART_COMPARED_DESIGNS_KEY', 'LOCAL_MYDESIGNS_COMPARED_DESIGNS_KEY', '_', 'MAX_COMPARISON_CHAIRS','Wheelchair', '$rootScope',
    function (localJSONStorage, Design, LOCAL_CART_COMPARED_DESIGNS_KEY, LOCAL_MYDESIGNS_COMPARED_DESIGNS_KEY, _, MAX_COMPARISON_CHAIRS , Wheelchair, $rootScope) {

    function isDesign(value) {
      return value instanceof Design;
    }

    function objectToDesign(designObj) {
      return new Design(designObj);
    }

    function isWheelchair(value){
      return value instanceof Wheelchair;
    }


  	var ComparedDesignsStorage = function (localStorageKey) {
      this.localStorageKey = localStorageKey;
  		this.designs = localJSONStorage.get(this.localStorageKey) || []; // restore from localStorage...default to empty array
      this.designs = this.designs.map(objectToDesign);

      ComparedDesignsStorage.prototype.saveLocally = function() {
        localJSONStorage.put(this.localStorageKey, this.designs);
      };

  		ComparedDesignsStorage.prototype.addDesign = function(design) {
  			if (!isDesign(design)) {
  				throw new Error("Argument to addDesign must be a Design instance");
  			} else if (this.designs.length >= MAX_COMPARISON_CHAIRS) {
          throw new Error("Already at max capacity for Design comparisons");
        } else {
  				this.designs.push(design);
          this.saveLocally();
  			}
  		};

  		ComparedDesignsStorage.prototype.setDesigns = function(designs) {
  			if (_.isArray(designs) && _.every(designs, isDesign)) {
          if (designs.length > MAX_COMPARISON_CHAIRS) {
            throw new Error("Can't have more than " + MAX_COMPARISON_CHAIRS + " compared designs at once");
          } else {
            this.designs = designs;
            this.saveLocally();
          }
        } else {
          throw new Error("Bad Argument Type to setDesigns...must be array of Design instances");
        }
  		};

      ComparedDesignsStorage.prototype.getDesigns = function() {
        return _.cloneDeep(this.designs).map(function (designObj) {
          return new Design(designObj);
        });
      };

      ComparedDesignsStorage.prototype.contains = function(queryDesign) {
        var matchingDesign = _.find(this.designs, function (design) {
          return _.isEqual(design, queryDesign);
        });

        return !_.isUndefined(matchingDesign);
      };

      ComparedDesignsStorage.prototype.removeDesign = function(queryDesign) {
        var matchindDesignIdx = _.findIndex(this.designs, function (design) {
          return _.isEqual(design, queryDesign);
        });

        if (matchindDesignIdx === -1) {
          return false;
        } else {
          this.designs.splice(matchindDesignIdx, 1);
          this.saveLocally();
          return true;
        }
      };

      ComparedDesignsStorage.prototype.isFull = function() {
        return this.designs.length >= MAX_COMPARISON_CHAIRS;
      };

      ComparedDesignsStorage.prototype.clear = function () {
        this.designs = [];
        this.saveLocally();
      }
  	};

  	var stores = {
      cart: new ComparedDesignsStorage(LOCAL_CART_COMPARED_DESIGNS_KEY),
      myDesigns: new ComparedDesignsStorage(LOCAL_MYDESIGNS_COMPARED_DESIGNS_KEY)
    };

    // Every time user logs in or out, clear the ComparedDesigns storage
    $rootScope.$on('userChange', function () {
      _.forEach(stores, function (storage) {
        storage.clear();
      });
    });

    return stores;
  }]);
