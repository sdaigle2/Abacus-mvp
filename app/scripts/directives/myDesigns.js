/**
 * Created by zhoufeng on 3/11/16.
 */
angular.module('abacuApp')
  .directive('myDesigns', function(){
    return{
      restrict:'AE',
      controller:'MyDesignsCtrl',
      templateUrl:'../../views/mydesigns.html'
    }
  });
