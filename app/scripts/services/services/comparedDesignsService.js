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
 */
angular.module('abacuApp')
  .constant('LOCAL_COMPARE_DESIGNS_KEY', 'comparedDesigns')
  .constant('MAX_COMPARISON_CHAIRS', 3)
  .service('ComparedDesigns', ['localJSONStorage', 'Design', 'LOCAL_COMPARE_DESIGNS_KEY', '_', 'MAX_COMPARISON_CHAIRS',
    function (localJSONStorage, Design, LOCAL_COMPARE_DESIGNS_KEY, _, MAX_COMPARISON_CHAIRS) {

    function isDesign(value) {
      return value instanceof Design;
    }

  	var ComparedDesigns = function () {
  		this.designs = localJSONStorage.get(LOCAL_COMPARE_DESIGNS_KEY) || [];

      ComparedDesigns.prototype.saveLocally = function() {
        localJSONStorage.put(LOCAL_COMPARE_DESIGNS_KEY, this.designs);
      };

  		ComparedDesigns.prototype.addDesign = function(design) {
  			if (!isDesign(design)) {
  				throw new Error("Argument to addDesign must be a Design instance");
  			} else if (this.designs.length >= MAX_COMPARISON_CHAIRS) {
          throw new Error("Already at max capacity for Design comparisons");
        } else {
  				this.designs.push(design);
          this.saveLocally();
  			}
  		};

  		ComparedDesigns.prototype.setDesigns = function(designs) {
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

      ComparedDesigns.prototype.getDesigns = function() {
        return _.cloneDeep(this.designs).map(function (designObj) {
          return new Design(designObj);
        });
      };

      ComparedDesigns.prototype.isFull = function() {
        return this.designs.length >= MAX_COMPARISON_CHAIRS;
      };

  	};

  	return new ComparedDesigns();
  }]);