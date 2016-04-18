/**
 * Directive can be applied to any element that fires 'load' and 'error' events
 * Main use is with <img> elements for the tinker page
 * Keeps track of progress of all elements with this tag and updates loading bar appropriately
 */

angular.module('abacuApp').directive("showProgressOnBar", ['$parse', 'ProgressTracker', function ($parse, ProgressTracker) {
	// Set the mutation observer
    window.MutationObserver = window.MutationObserver
	    || window.WebKitMutationObserver
	    || window.MozMutationObserver; // goes by different names in different browsers

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

        	if (!window.MutationObserver) {
        		return; // this directive cant do anything if browser doesnt support MutationObserver's
        	}

        	var itemIsAdded = false;

            function shouldTrackProgress() {
            	return $parse(attrs.showProgressOnBar)(scope);
            }

            element.bind('load', function() {
            	if (shouldTrackProgress()) {
                	ProgressTracker.itemLoaded();
            	}
            });

            element.bind('error', function () {
            	if (shouldTrackProgress()) {
            		ProgressTracker.itemFailed();
            	}
            });
            
            // create an observer instance
            var observer = new MutationObserver(function(mutations) {
            	if (shouldTrackProgress()) {
	                var changedSource = mutations.some(function (mutation) {
	                	return mutation.attributeName === 'src';
	                });

	                if (changedSource) {
	                	if (itemIsAdded) {
	                		ProgressTracker.itemLoaded();
	                	}

	                	ProgressTracker.addItem();
	                	itemIsAdded = true;
	                }
            	}
            });

            // configuration of the observer:
            var config = {
                attributes: true // this is to watch for attribute changes.
            };

            // pass in the element you wanna watch as well as the options
            observer.observe(_.first(element), config);
        }
    };
}]);
