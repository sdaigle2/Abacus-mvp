'use strict';

/*
* This Factory creates a Design object
* Designs contain a wheelchair reference and a creator field linking the design back to the creator of the wheelchair
*/


angular.module('abacuApp')
  .factory('Design', ['Wheelchair', '_', function (Wheelchair, _) {
  	var Design = function (designObj) {
  		this._id = designObj._id || designObj.id || null;
      this._rev = designObj._rev || designObj.rev || null;
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

  			if (!_.isUndefined(this._id) && !_.isNull(this._id)) {
  				details._id = this._id;
  			}

        if (!_.isUndefined(this._rev) && !_.isNull(this._rev)) {
          details._rev = this._rev;
        }

  			return details;
  		};

      // Used so you can know whether you need to generate a unique design ID for
      // the design or if it already has one
      Design.prototype.hasID = function() {
        return _.has(this, '_id') && !(_.isNull(this._id) || _.isEmpty(this._id));
      };
  	};

  	return Design;
  }]);