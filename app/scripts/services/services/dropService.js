/**
 * Created by Dhruv on 7/6/2015.
 */
angular.module('abacuApp')
  .service('Drop', [function () {
    var loginDropdown = false;
    var settingsDropdown = false;
    return {
      loginDropdown: function(){
        return loginDropdown;
      },
      settingsDropdown: function(){
        return settingsDropdown;
      },
      toggleLogin: function(){
        loginDropdown = !loginDropdown;
      },
      toggleSettings: function(){
        settingsDropdown = !settingsDropdown;
      },
      setTrue: function(){
        loginDropdown = true;
      },
      setFalse: function(){
        loginDropdown = false;
        settingsDropdown = false;
      }
    }
  }]);
