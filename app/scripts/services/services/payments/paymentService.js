'use strict';

angular.module('abacuApp')
  .service('PaymentAPI', ['$http', function ($http) {

    function createPayment(amount, payType, token, order, creditCard, checkNum, memo) {
      return $http({
          url: 'orders/create-payment',
          method: 'POST',
          data: {
            paymentAmount: amount,
            payType: payType,
            token: token, 
            order: order, 
            creditCard: creditCard, 
            checkNum: checkNum,
            memo: memo
          }
      })
      .then(pushResponse)
      .catch(handleError)
    };

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

    return {
      createPayment: createPayment
    };
  }]);