/**
 * Created by Dhruv on 7/6/2015.
 */
angular.module('abacuApp')
  .service('Drop', ['$q', function ($q) {

    function getResolvedDeferred() {
      var deferred = $q.defer();
      deferred.resolve(); // make it already resolved
      return deferred;
    }

    var loginDropdown = false;
    var settingsDropdown = false;

    // Each attribute ('login' & 'settings') is null when the dropdown is closed, and holds a deferred promise object when its opened
    // The deferred promise is resolved when the corresponding dropdown boolean is set to false
    var dropDownClosePromises = {
      'login': getResolvedDeferred(),
      'settings': getResolvedDeferred()
    };

    return {
      loginDropdown: function(){
        return loginDropdown;
      },
      settingsDropdown: function(){
        return settingsDropdown;
      },

      toggleLogin: function(){
        loginDropdown = !loginDropdown;
        
        if (loginDropdown) {
          // The settings dropdown was just opened, reset the deferred promise
          dropDownClosePromises.login = $q.defer();
        } else { // If you closed the dropdown, then resolve the promise
          dropDownClosePromises.login.resolve();
        }

        return dropDownClosePromises.settings.promise;
      },

      toggleSettings: function(){
        settingsDropdown = !settingsDropdown;
        
        if (settingsDropdown) {
          // The settings dropdown was just opened, reset the deferred promise
          dropDownClosePromises.settings = $q.defer();
        } else { // If you closed the dropdown, then resolve the promise
          dropDownClosePromises.settings.resolve();
        }

        return dropDownClosePromises.settings.promise;
      },
      setTrue: function(){
        if (!loginDropdown) { // if you're opening a closed dropdown, resolve the previous promise for it and reset the deferred promise 
          dropDownClosePromises.login.resolve(); // resolve the previous promise, though it already should be resolved
          dropDownClosePromises.login = $q.defer();
        }

        loginDropdown = true;
        return dropDownClosePromises.login.promise; // return the promise which will be resolved once the dropdown is closed
      },
      setFalse: function(){
        if (loginDropdown) { // if the dropdown is open, resolve the promise for it since its about to be closed
          dropDownClosePromises.login.resolve();
        }

        if (settingsDropdown) { // if the dropdown is open, resolve the promise for it since its about to be closed
          dropDownClosePromises.settings.resolve();
        }

        loginDropdown = false;
        settingsDropdown = false;
      }
    }
  }]);
