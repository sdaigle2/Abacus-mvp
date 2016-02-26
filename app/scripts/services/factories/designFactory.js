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

  		Design.prototype.allDetails = function() {
  			var instance = this;
  			var details = {
  				'creator': instance.creator,
  				'wheelchair': instance.wheelchair.getAll()
  			};

  			if (!_.isUndefined(this.id) && !_.isNull(this.id)) {
  				details.id = this.id;
  			}

  			return details;
  		};
  	};

  	return Design;
  }]);