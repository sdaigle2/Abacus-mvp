/**
 * Created by zhoufeng on 3/11/16.
 */
angular.module('abacuApp')
  .directive('register', function(){
    return{
      restrict:'AE',
      scope:'true',
      controller:'RegisterCtrl',
      templateUrl:'views/register/register.html'
    }
  });
