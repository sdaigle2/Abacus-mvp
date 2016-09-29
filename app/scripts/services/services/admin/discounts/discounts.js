(function() {
  'use strict';

  angular
    .module('abacuApp')
    .controller('DiscountsController', DiscountsController);
    
    DiscountsController.$inject = ['$scope', '$location', 'User', '_', 'discountsService'];

    function DiscountsController($scope, $location, User, _, discountsService) {
      var discount = this,
      discountToEdit = discountsService.getEditDiscount(),
      discountLimitMessage = 'As an admin, you may only create discount codes no greater than 25%. Please contact Chris, Danny, or Cesar for approval to create a larger discount.';

      function validateFields(obj) {
        if (!obj.startDate || !obj.endDate || !obj.id || !obj.percent) return 'Please fill in all the fields.';
        if (typeof obj.id !== 'string') return 'ID should be letters and numbers.';
        if (isNaN(obj.percent)) return 'Percent should be a number.';
        if (obj.percent > 100 || obj.percent <= 0) return 'Percent must be between 0 and 100.';
        return '';
      }

      discount.discountObj = discountToEdit || {};
      discount.discountObj.percent = parseInt(discount.discountObj.percent * 100) || '';
      discount.discountObj.isMultiDiscount = discount.discountObj.isMultiDiscount || false;
      discount.discountObj.id = discount.discountObj.id || discount.discountObj._id;
      discount.editDiscountPage = false;
      discount.dropdownOpen = false;
      discount.format = 'dd-MMMM-yyyy';
      discount.popup1 = {
        opened: false
      };
      discount.popup2 = {
        opened: false
      };
      discount.errorMsg = '';

      discount.toAdmin = function() {
        $location.path('/admin');
      };

      discount.closeDropDown = function() {
        discount.discountObj = {};
        discount.dropdownOpen = false;
      };

      discount.open1 = function() {
          discount.popup1.opened = true;
      };

      discount.open2 = function() {
          discount.popup2.opened = true;
      };

      discount.saveEditDiscount = function() {
        discount.errorMsg = validateFields(discount.discountObj);
        if (!discount.errorMsg)  {
          discount.discountObj.id = discount.discountObj.id.toLowerCase();
          discount.errorMsg = '';
          
          if (User.getUserType() !== 'superAdmin' && discount.discountObj.percent > 25) {
            discount.discountObj = {};
            return discount.errorMsg = discountLimitMessage;
          }
          discountsService.editDiscount(discount.discountObj)
          .then(function() {
            discount.dropdownOpen = true;
          })
          .catch(function(err) {
            discount.errorMsg = err.message;
          });
        } else {
          discount.successMsg = '';
        }
      };

      discount.submitDiscount = function() {
        discount.errorMsg = validateFields(discount.discountObj);
        if (!discount.errorMsg)  {
          discount.discountObj.id = discount.discountObj.id.toLowerCase();
          discount.errorMsg = '';
          
          if (User.getUserType() !== 'superdiscount' && discount.discountObj.percent > 25) {
              discount.discountObj = {};
              return discount.errorMsg = discountLimitMessage;
          }

          discountsService.createDiscount(discount.discountObj)
          .then(function() {
              discount.successMsg = 'Discount successfully created.';
              discount.discountObj = {};
          })
          .catch(function(err) {
              discount.errorMsg = err.message;
          });
        } else {
          discount.successMsg = '';
        }
      };
    }
})();
