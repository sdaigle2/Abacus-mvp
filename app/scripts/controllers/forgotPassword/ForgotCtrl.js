'use strict';

angular.module('abacuApp')
    .controller('ForgotCtrl', ['$scope','$http','$routeParams', '$location', 'ForgotAPI', function (
        $scope, $http, $routeParams, $location, ForgotAPI
    ) {
        $scope.success = '';
        $scope.error = '';
        $scope.form = {};
        $scope.params = {};
        $scope.user = {};
        $scope.emptyField = {}
        $scope.getResetLink = getResetLink;
        $scope.changePassword = changePassword;
        $scope.checkResetPasswordToken = checkResetPasswordToken;
        
        function getResetLink(form) {
            if(form.$valid) {
                $scope.linkSent = true;
                ForgotAPI.sendResetPasswordLink($scope.params.email)
                .then(function(){
                    $scope.linkSent = false;
                    $scope.success = 'Email sent';
                    $scope.error = '';
                })
                .catch(function(err) {
                    $scope.success = '';
                    $scope.error = err.message;
                    $scope.linkSent = false;
                })
            } else {
                return;
            }

        };
        function changePassword(form) {
            if(form.$valid) {
                $scope.passChangedReq = true;
                $scope.user.newPassword = $scope.params.password;
                $scope.user.email = $scope.params.email;
                ForgotAPI.setPassword($scope.user)
                .then(function(resp){
                    $scope.success = 'Your password has been successfully changed.'; 
                })
                .catch(function(err) {
                    $scope.error = err.message;
                })
            } else {
                if (form.$error.required) {
                    for (var key in form.$error.required){
                        $scope.emptyField[form.$error.required[key].$name] = true;
                    }
                    return $scope.error = 'Please fill all the required field';
                } else if (form.$error.email) {
                    return $scope.error = 'Please enter a valid email address';
                }
                $scope.error = 'Passwords should match and be at least 8 characters long';
            }
        };

        function checkResetPasswordToken() {
            ForgotAPI.checkResetPasswordCode($routeParams.resetToken)
            .then(function() {
                return
            })
            .catch(function() {
                $location.path('/');
            })
        };
    }]);
