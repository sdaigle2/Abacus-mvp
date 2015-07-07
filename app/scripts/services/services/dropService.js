/**
 * Created by Dhruv on 7/6/2015.
 */
angular.module('abacuApp')
  .service('Drop', [function () {
    var dropdown = false;
    return {
      drop: function(){
        return dropdown;
      },
      toggle: function(){
        dropdown = !dropdown;
      },
      setTrue: function(){
        dropdown = true;
      },
      setFalse: function(){
        dropdown = false;
      }
    }
  }]);
