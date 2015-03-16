// This controller checks for a change in the active controller for the
// app and updates the navbar to highlight the current page
'use strict';

function HeaderController($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}
