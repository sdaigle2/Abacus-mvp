(function() {
  'use strict';

  angular
    .module('abacuApp')
    .factory('discountsService', discountsService);

  discountsService.$inject = ['$http'];

  function discountsService($http) {
    var savedDiscount = {}
    var service = {
      createDiscount: createDiscount,
      getDiscounts: getDiscounts,
      getEditDiscount: getEditDiscount,
      setEditDiscount: setEditDiscount,
      editDiscount: editDiscount,
      deleteDiscount: deleteDiscount
    };
    return service;

    function createDiscount(discount) {
      return $http({
        url: 'discounts',
        method: 'POST',
        data: discount
      })
      .then(pushResponse)
      .catch(handleError);
    };

    function editDiscount(discount) {
      return $http({
        url: 'discounts/' + discount.id,
        method: 'PUT',
        data: discount
      })
      .then(pushResponse)
      .catch(handleError);
    };

    function deleteDiscount(discountId) {
      return $http({
        url: 'discounts/' + discountId + '/expire',
        method: 'POST'
      })
      .then(pushResponse)
      .catch(handleError);
    };

    function getDiscounts() {
      return $http({
        url: 'discounts',
        method: 'GET'
      })
      .then(pushResponse)
      .catch(handleError);
    };

    function getEditDiscount() {
      return savedDiscount;
    }

    function setEditDiscount(data) {
      savedDiscount = data;
    }

    // Handling responses
    function pushResponse(resp) {
      return resp.data;
    };

    function handleError(err) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(err.data.msg || err.msg);
      } 
    };
  }
})();
