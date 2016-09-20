(function() {
  'use strict';

  angular
    .module('abacuApp')
    .factory('UsersAPI', users);

  users.$inject = ['$http'];

  function users($http) {
    var service = {
      getUsers: getUsers,
      resetPassword: resetPassword,
      setUserType: setUserType
    };
    return service;

    function getUsers() {
      return $http({
        url: 'users',
        method: 'GET'
      })
      .then(pushResponse)
      .catch(handleError);
    };

    function resetPassword(email) {
      return $http({
        url: 'users/email/' + email + '/request-reset-password',
        method: 'POST'
      })
      .then(pushResponse)
      .catch(handleError);
    };

    function setUserType(id, userType) {
      return $http({
        url: 'users/change-user-type',
        method: 'POST',
        data: {id: id, userType: userType}
      })
      .then(pushResponse)
      .catch(handleError);
    };
    

    // Handling responses
    function pushResponse(resp) {
      return resp.data;
    };

    function handleError(err) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(err.data ? err.data.msg : err.msg);
      } 
    };
  }
})();
