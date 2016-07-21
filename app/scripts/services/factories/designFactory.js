'use strict';
//notice: most of the wheelchair instance in controller will be the design instance, which contains a wheelchair instance and creator info.

/*
* This Factory creates a Design object
* Designs contain a wheelchair reference and a creator field linking the design back to the creator of the wheelchair
*/


angular.module('abacuApp')
  .factory('Design', ['Wheelchair', '_', '$http', function (Wheelchair, _, $http) {
  	var Design = function (designObj) {
      Design.prototype.init = function(designObj) {
        this._id = designObj._id || designObj.id || null;
        this._rev = designObj._rev || designObj.rev || null;      //important to keep _rev in sync with remoteDB
        this.creator = designObj.creator || null;                 //contains userID
        this.wheelchair = new Wheelchair(designObj.wheelchair);
        this.createdAt = new Date(designObj.createdAt || Date.now());
        this.updatedAt = new Date(designObj.updatedAt || Date.now());
      };

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

      Design.prototype.pullUpdatedCopy = function() {
        return $http({
            url:'/design/' + this._id,
            data:{designID:id},
            method:'GET'
        })
        .then(function (res) {
          var updatedDesignObj = res.data;
          this.init(updatedDesignObj);
          return this;
        })
      };

      // Send
      Design.prototype.pushCurrentVersion = function() {
        return $http({
          url:'/design/' + this._id,
          data: this.allDetails(),
          method: 'PUT'
        })
        .then(function (res) {
          var updatedDesignObj = res.data;
          this.init(updatedDesignObj);
          return this;
        })
      };

      // Creates a copy of the current design but with the ID and revision number attributes removed
      Design.prototype.clone = function () {
        var designDetails = this.allDetails();

        // Trying to make a fresh copy so remove these attrs
        delete designDetails._id;
        delete designDetails._rev;

        return new Design(designDetails);
      };

      this.init(designObj); // call the constructor
  	};

    //Do not touch this
  	return Design;
  }]);
