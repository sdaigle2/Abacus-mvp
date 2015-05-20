'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static factory:syncJSON
 * @description
 * # syncJSON
 * Service of the abacuApp
 */
angular.module('abacuApp')
  .service('syncJSON', [function () {

    //Use this service to load in JSON synchronously
    //You should only do this when instantiating a service/factory

    return {

      // Load JSON text from server hosted file and return JSON parsed object
      loadJSON: function (filePath) {
          // Load json file;
          var json = loadTextFileAjaxSync(filePath, "application/json");
          // Parse json
          return JSON.parse(json);
        }
    };

    // Load text with Ajax synchronously: takes path to file and optional MIME type
    function loadTextFileAjaxSync(filePath, mimeType) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", filePath, false);
      if (mimeType != null) {
        if (xmlhttp.overrideMimeType) {
          xmlhttp.overrideMimeType(mimeType);
        }
      }
      xmlhttp.send();
      if (xmlhttp.status == 200) {
        return xmlhttp.responseText;
      }
      else {
        // TODO Throw exception
        return null;
      }
    };

  }]);


