'use strict';

angular.module('abacuApp').factory('ForgotAPI', function ($http) {

    function sendResetPasswordLink (mail) {
        return $http({
            url: '/reset-link/' + mail,
            method: 'POST'
        })
        .then(pushResponse)
        .catch(handleError)
    }

    function checkResetPasswordCode (resetToken) {
        return $http({
            url: '/password-reset-key/' + resetToken,
            method: 'GET'
        })
        .then(pushResponse)
        .catch(handleError)
    }

    function setPassword (params) {
        return $http({
            url: '/change-user-password',
            method: 'PUT',
            data: params
        })
        .then(pushResponse)
        .catch(handleError)
    }

    function pushResponse(resp) {
        return resp.data;
    }

    function handleError(err) {
        if (err instanceof Error) {
            throw err;
        } else {
            throw new Error(err.data.msg);
        } 
    }

    return {
        sendResetPasswordLink: sendResetPasswordLink,
        checkResetPasswordCode: checkResetPasswordCode,
        setPassword: setPassword
    };

});
