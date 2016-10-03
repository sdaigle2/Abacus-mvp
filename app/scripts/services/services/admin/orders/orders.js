(function() {
  'use strict';

  angular
    .module('abacuApp')
    .controller('OrdersController', OrdersController);
    
    OrdersController.$inject = ['$scope', '$location', 'User', '_', 'ordersService', '$routeParams', 'PAYMENT_TYPES'];

    function OrdersController($scope, $location, User, _, ordersService, $routeParams, PAYMENT_TYPES) {
      var order = this;

      activate();

      order.choosePaymentType = function(payType) {
        order.payment.payType = payType;
      };

      order.saveOrder = function() {
        delete order.orderToEdit.date;
        var changedStatus = order.newOrderStatus !== order.orderToEdit.orderStatus ? order.newOrderStatus : null;
        if (order.payment.amountPaid) {
          if (validFields()) {
            addPayment();
            if (changedStatus) {
              order.orderToEdit.orderStatus = changedStatus;
            }
            return ordersService.saveEditOrder(order.orderToEdit)
            .then(cb);
          } else {
            return;
          }
        }
        order.orderToEdit.orderStatus = changedStatus;

        ordersService.saveEditOrder(order.orderToEdit)
        .then(cb);

        function cb(resp) {
          order.dropdownOpen = true;
        }
      };

      order.closeDropDown = function() {
        activate();
        order.dropdownOpen = false;
      };

      order.goToOrders = function() {
        $location.path('/admin');
      };

      $scope.$watch('[order.payment.amountPaid,  order.newOrderStatus]', function(nVal, oVal) {
        order.errorMsg = '';
        if (nVal[0] || nVal[1] !== order.orderToEdit.orderStatus) {
          order.saveButton = true;
        } else {
          order.saveButton = false;
        }
      });

      function activate() {
        order.payment = {};
        order.saveButton = false;
        order.dropdownOpen = false;
        order.PAYMENT_TYPES = PAYMENT_TYPES;
        order.orderToEdit = ordersService.getOrderToEdit();
        order.payment.payType = order.orderToEdit.payType;
        order.newOrderStatus = order.orderToEdit.orderStatus;

        if (_.isEmpty(order.orderToEdit)) {
          ordersService.getOrder($routeParams.orderId)
          .then(function(resp) {
            order.orderToEdit = resp;
            order.payment.payType = order.orderToEdit.payType;
            order.newOrderStatus = order.orderToEdit.orderStatus;
          })
        }
      }

      function addPayment() {
        order.payment.amountPaid = Number(order.payment.amountPaid.toFixed(2));
        order.orderToEdit.payments.push({
          "date": new Date(),
          "method": order.payment.payType,
          "amount": order.payment.amountPaid,
          "checkNumber": order.payment.checkNum || '',
          "ccNum": order.payment.payType === 'Credit Card' ? order.payment.card.number.substr(order.payment.card.number.length - 4) : '',
          "stripeId": '',
          "memo": order.payment.memo || ''
        });
        order.orderToEdit.totalDueLater = order.orderToEdit.totalDueLater - order.payment.amountPaid;

        var status = createStatus(order.orderToEdit.totalDueLater, order.orderToEdit.totalDue);
        order.orderToEdit.orderStatus = status.orderStatus;
        order.orderToEdit.paymentStatus = status.paymentStatus;

        function createStatus(totalDueLater, total) {
          if (totalDueLater === 0) return {'orderStatus': 'Full payment has been received. Chair will ship once it is complete.', 'paymentStatus': 'Paid in full'};
          if (totalDueLater > total / 2) return {'orderStatus': 'waiting for 50% payment before starting to build your chair', 'paymentStatus': 'incomplete'};
          if (totalDueLater < total / 2) return {'orderStatus': 'Thankyou for the downpayment, we’ll start building your wheelchair now. Please note that you will need to pay the remainder before the order ships.', 'paymentStatus': 'At least 50% paid'};
        }
      }

      function validFields() {
        if (order.payment.amountPaid < 0 || order.payment.amountPaid > order.orderToEdit.totalDueLater) {
          order.errorMsg = 'Please enter a value between 0 and ' + order.orderToEdit.totalDueLater;
          return false;
        } else if (order.payment.payType === 'Credit Card' && !order.payment.card)  {
          order.errorMsg = 'Please enter card information';
          return false;
        } else if (order.payment.payType === 'Credit Card' && order.payment.card && order.payment.card.number.length !== 16) {
          order.errorMsg = 'Credit card number is not correct';
          return false;
        } else {
          return true;
        }
      }
    }
})();
