(function() {
  'use strict';

  angular
    .module('abacuApp')
    .factory('usersService', usersService);

  usersService.$inject = ['$http'];

  function usersService($http) {
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

    function setUserType(id, userObj) {
      return $http({
        url: 'users/' + userObj._id,
        method: 'PUT',
        data: {userObj: userObj}
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
