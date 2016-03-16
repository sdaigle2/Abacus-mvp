/**
 * Created by zhoufeng on 3/11/16.
 */
angular.module('abacuApp')
  .directive('register', function(){
    return{
      restrict:'E',
      controller:'RegisterCtrl',
      scope:false,
      templateUrl:'../../views/tinker/registerPanel.html'
    }
  });
