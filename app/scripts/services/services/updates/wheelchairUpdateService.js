'use strict';

angular.module('abacuApp')
  .service('WheelchairUpdate', ['$http', 'localJSONStorage', 'Errors', 'PromiseUtils', 'Design', function ($http, localJSONStorage, Errors, PromiseUtils, Design) {
    function restoreCurrentWheelchair(data) {
      self.userID = data.userID;
      if (self.userID !== -1) {
        var wIndex = 0;
        while (localJSONStorage.get('design' + wIndex)){
          localJSONStorage.remove('design' + wIndex);
          wIndex++;
        }

        self.currentWheelchair = data.currentWheelchair || self.currentWheelchair;

        self.currentWheelchair.design = self.currentWheelchair.design ? new Design(self.currentWheelchair.design) : null;
        return self.currentWheelchair;
      }
    }

    function updateCurrentWheelchair(currentWheelchair) {
        var data = {
          'currentWheelchair': currentWheelchair
        };
        if (self.userID !== -1) {
          return $http({
            url: '/users/current/current-wheelchair',
            data: data,
            method: 'POST'
          })
            .then(function (response) {
              return restoreCurrentWheelchair(response.data);
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
      update: updateCurrentWheelchair
    };
  }]);
