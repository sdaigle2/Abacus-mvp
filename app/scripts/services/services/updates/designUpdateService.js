'use strict';

angular.module('abacuApp')
  .service('DesignUpdate', ['$http', 'localJSONStorage', 'Errors', 'PromiseUtils', 'Design', function ($http, localJSONStorage, Errors, PromiseUtils, Design) {
    function restoreSavedDesigns(data) {
      self.userID = data.userID;
      if (self.userID !== -1) {
        var wIndex = 0;
        while (localJSONStorage.get('design' + wIndex)){
          localJSONStorage.remove('design' + wIndex);
          wIndex++;
        }
        self.savedDesigns = !_.isArray(data.savedDesigns) ? [] : data.savedDesigns.map(function (designObj) {
          return _.isObject(designObj) ? new Design(designObj) : designObj; // might just be a design ID string
        });
        return self.savedDesigns;
      }
    }

    function updateSavedDesigns(designs) {
      var data = {
        'savedDesigns': designs
      };
      if (self.userID !== -1) {
        return $http({
          url: '/users/current/designs',
          data: data,
          method: 'POST'
        })
          .then(function (response) {
            return restoreSavedDesigns(response.data);
          })
          .catch(function(err) {
            throw new Error(err);
          });
      } else {
        //generate rejected promise. details see in the promiseUtil under services in the server_script
        return PromiseUtils.rejected(new Errors.NotLoggedInError('User Must Be Logged In For This Action'));
      }
    }
    return {
      update: updateSavedDesigns
    };
  }]);