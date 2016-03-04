'use strict';

/*
* This Factory creates a Design object
* Designs contain a wheelchair reference and a creator field linking the design back to the creator of the wheelchair
*/


angular.module('abacuApp')
  .factory('Design', ['Wheelchair', '_', function (Wheelchair, _) {
  	var Design = function (designObj) {
  		this.id = designObj._id || designObj.id;
  		this.creator = designObj.creator;
  		this.wheelchair = new Wheelchair(designObj.wheelchair);
      this.createdAt = new Date(designObj.createdAt || Date.now());
      this.updatedAt = new Date(designObj.updatedAt || Date.now());

  		Design.prototype.allDetails = function() {
  			var instance = this;
  			var details = {
  				'creator': instance.creator,
          'createdAt': this.createdAt,
          'updatedAt': this.updatedAt,
  				'wheelchair': instance.wheelchair.getAll()
  			};

  			if (!_.isUndefined(this.id) && !_.isNull(this.id)) {
  				details.id = this.id;
  			}

  			return details;
  		};

      // Used so you can know whether you need to generate a unique design ID for
      // the design or if it already has one
      Design.prototype.hasID = function() {
        return _.has(this, 'id') && !(_.isNull(this.id) || _.isEmpty(this.id));
      };
  	};

  	return Design;
  }]);