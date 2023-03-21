'use strict';

angular.module('abacuApp')
  .service('CartUpdate', ['$http', 'localJSONStorage', 'Errors', 'PromiseUtils', 'Order', 'Costs',
    function ($http, localJSONStorage, Errors, PromiseUtils, Order, Costs) {

    function restoreCart(cart) {
      var cartID = cart.id || cart._id || null;
      var wIndex = 0;
      while (localJSONStorage.get('design' + wIndex)){
        var wheelchair = localJSONStorage.get('design' + wIndex);
        var temp = true;
        cart.wheelchairs.forEach(function(remoteWheelchair){
          temp = temp && (!_.includes(remoteWheelchair, wheelchair._id ));
        });
        if (temp)
          cart.wheelchairs.push(wheelchair);
        localJSONStorage.remove('design' + wIndex);
        wIndex++;
      }

      var wIndex = 0;
      while (localJSONStorage.get('design' + wIndex)){
        localJSONStorage.remove('design' + wIndex);
        wIndex++;
      }
      return self.cart = cart && cartID !== null ? new Order(Costs.TAX_RATE, Costs.SHIPPING_FEE, cart) : null;
    }

    function updateCart(data) {
      console.log(data)
      console.log('update cart in cartUpdateService.js')
      if (self.userID !== -1) {
        return $http({
          url: '/users/current/cart',
          data: data,
          method: 'POST'
        })
          .then(function (response) {
            console.log(response.data)
            return restoreCart(response.data);
          })
          .catch(function(err) {
            console.log(err)
            throw new Error(err);
          });
      } else {
        return PromiseUtils.rejected(new Errors.NotLoggedInError('User Must Be Logged In For This Action'));
      }
    }
    return {
      update: updateCart
    };
  }]);