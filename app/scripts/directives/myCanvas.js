angular.module('abacuApp')
	.directive('myCanvas', ['$compile', 'cfpLoadingBar', function ($compile, cfpLoadingBar) {
	  return function (scope, element, attrs) {
	    console.log(attrs);
	    var canvas_images = JSON.parse(attrs.imgArr);
	    console.log(canvas_images);
	    console.log(canvas_images.length);
	    var stack = new Array();
	    stackImages(element[0], canvas_images, attrs.width, attrs.width*603/780, cfpLoadingBar);
	  }
	}]);
