angular.module('abacuApp').directive("applyOnResize", function($window) {
  return function($scope, $element) {
    return $element($window).bind("resize", $scope.$apply);
  };
});
