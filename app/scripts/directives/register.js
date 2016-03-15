/**
 * Created by zhoufeng on 3/11/16.
 */
angular.module('abacuApp')
  .directive('register', function(){
    return{
      restrict:'AE',
      controller:'RegisterCtrl',
      templateUrl:'../../views/tinker/registerPanel.html'
    }
  });
