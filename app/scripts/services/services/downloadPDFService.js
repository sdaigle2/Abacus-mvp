'use strict';

// no longer in use

/**
 * @ngdoc function
 * @name abacuApp.static factory:downloadPDF
 * @description
 * # downloadPDF 
 * Service of the abacuApp
 */
angular.module('abacuApp')
  .service('DownloadPDF', ['$http', '_', 'Design', '$window', function ($http, _, Design, $window) {
    return {
      forWheelchairs: function (wheelchairs) {
        wheelchairs = _.isArray(wheelchairs) ? wheelchairs : [wheelchairs];
        return $http({
          'method': 'POST',
          'url': '/design/pdf/',
          'data': wheelchairs.map(function (chair) {
            return chair instanceof Design ? chair.allDetails() : chair;
          })
        })
        .then(function (res) {
          var pdfURL = res.data.url;
          return $window.open(pdfURL, '_blank');
        });
      }
    };
  }]);

