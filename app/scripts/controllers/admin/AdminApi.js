'use strict';

angular.module('abacuApp').factory('AdminAPI', function ($http) {
    function createDiscount(discount) {
        return $http({
            url: 'discounts',
            method: 'POST',
            data: discount
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
            throw new Error(err.data.msg);
        } 
    };

    return {
        createDiscount: createDiscount
    };

});
