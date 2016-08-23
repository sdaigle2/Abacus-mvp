angular.module('abacuApp')
  .directive('toggleClass', function($document, $timeout){
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.parent().toggleClass(attrs.toggleClass);
                element.children().toggleClass('open-handler');
            });

            var handler = function(event) {
                if (!element.parent()[0].contains(event.target) && element.parent().hasClass('open')) {
                    element.parent().toggleClass(attrs.toggleClass);
                 }
            };

            $document.on('click', handler);
            scope.$on('$destroy', function() {
                $document.off('click', handler);
            });
            scope.$on("toggleUserInfo", function (event, args) {
                element.children().toggleClass('open-handler');
                if (!element.parent().hasClass('open')) {
                    $timeout(function(){
                        element.parent().toggleClass('open');
                    }, 0);
                }
            });
        }
    };
  });