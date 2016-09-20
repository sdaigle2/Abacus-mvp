(function() {
  'use strict';

  angular
    .module('abacuApp')
    .factory('OrdersAPI', orders);

  orders.$inject = ['$http'];

  function orders($http) {
    var savedOrder = {};

    var service = {
      getOrder: getOrder,
      getOrders: getOrders,
      saveEditOrder: saveEditOrder,
      getOrderToEdit: getOrderToEdit,
      setOrderToEdit: setOrderToEdit
    };
    return service;

    function getOrder(orderId) {
      return $http({
        url: 'orders/' + orderId,
        method: 'GET'
      })
      .then(pushResponse)
      .catch(handleError);
    }

    function getOrders() {
      return $http({
        url: 'orders',
        method: 'GET'
      })
      .then(pushResponse)
      .catch(handleError);
    }

    function saveEditOrder(order, payment, status) {
      return $http({
        url: 'orders/' + order._id + '/edit',
        method: 'POST',
        data: order
      })
      .then(pushResponse)
      .catch(handleError);
    }

    function getOrderToEdit() {
      return savedOrder;
    }

    function setOrderToEdit(data) {
      savedOrder = data;
    }

    // Handling responses
    function pushResponse(resp) {
      return resp.data;
    }

    function handleError(err) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(err.data.msg || err.msg);
      } 
    }
  }
})();
