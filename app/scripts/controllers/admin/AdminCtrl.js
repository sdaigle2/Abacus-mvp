(function() {
  'use strict';

  angular
    .module('abacuApp')
    .filter('startFrom', function () {
      return function (input, start) {
        if (input) {
          start =+ start;
          return input.slice(start);
        }
        return [];
      };
    })
    .controller('AdminCtrl', adminFn);
    
    adminFn.$inject = ['$scope', '$location', 'User', '_', 'DiscountsAPI', 'UsersAPI', 'OrdersAPI', 'filterFilter', '$filter'];

    function adminFn($scope, $location, User, _, DiscountsAPI, UsersAPI, OrdersAPI, filterFilter, $filter) {
      var admin = this;

      admin.contentSection = {
        discounts: 'Discounts',
        users: 'Users',
        orders: 'Orders'
      };

      admin.setContentSection = function (newContentSection) {
        $location.search({
          'section': newContentSection
        });
      };

      admin.resetContentSection = function () {
        $location.search({
          'section': admin.contentSection.orders
        });
      };

      admin.getContentSection = function() {
        return $location.search().section || admin.contentSection.orders;
      };

      admin.init = function() {
        switch(admin.getContentSection()) {
          case 'Discounts':
            fillInDiscounts();
            break;
          case 'Users':
            fillInUsers();
            break;
          case 'Orders':
            fillInOrders();
            break;
        }

        admin.userType = User.getUserType();
      };

      admin.init();

      // DISCOUNTS
      var numberOfDiscounts;
      
      admin.editDiscount = function(discount) {
        var discountObj = discount.doc;
        discountObj.startDate = new Date(discount.doc.startDate);
        discountObj.endDate = new Date(discount.doc.endDate);
        discountObj.editDiscountPage = true;
        DiscountsAPI.setEditDiscount(discountObj);
        $location.path('/discounts');
      };

      admin.deleteDiscount = function(discount) {
        DiscountsAPI.deleteDiscount(discount.doc._id)
        .then(function(resp) {
          admin.discountsArray = _.reject(admin.discountsArray, function(item) {
             return item.doc._id === discount.doc._id;
          });
        })
      };

      admin.toDiscounts = function() {
        DiscountsAPI.setEditDiscount({});
        $location.path('/discounts');
      };

      admin.getPercents = function(number) {
        return parseInt(number * 100).toString() + '%';
      };

      function fillInDiscounts() {
        DiscountsAPI.getDiscounts()
          .then(handleDiscounts);
      };

      function handleDiscounts(resp){
        numberOfDiscounts = resp.total_rows;
        admin.discountsArray = _.sortBy(resp.rows, function(item) {
          return new Date(item.doc.createdAt).getTime()*-1;
        });

        admin.discountsArray = admin.discountsArray.filter(function(discount) {
          return new Date(discount.doc.endDate) >= new Date();
        })
      };

      // USERS
      var numberOfUsers;

      admin.currentPage = 1;
      admin.numPerPage = 25;
      admin.profile = {};
      admin.profile.open = false;

      admin.openProfile = function(profile) {
        admin.userProfile = profile;
        admin.profile.id = profile.id;
        admin.profile.email = profile.doc.email;
        admin.profile.fName = profile.doc.fName;
        admin.profile.lName = profile.doc.fName;
        admin.profile.ordersNum = profile.doc.orders ? profile.doc.orders.length : 0;
        admin.profile.phone = profile.doc.phone;
        admin.profile.city = profile.doc.city;
        admin.profile.userType = profile.doc.userType ? profile.doc.userType : 'basic';
        admin.profile.initialUserType = admin.profile.userType;
        admin.profile.open = true;

        watchUserType();
      };

      admin.closeProfile = function() {
        admin.profile = {};
        admin.profile.open = false;
      };

      admin.getUserType = function(type) {
        switch(type || admin.profile.userType) {
          case 'superAdmin':
            return 'Super Admin';
            break;
          case 'basic':
            return 'Basic';
            break;
          case 'admin':
            return 'Admin';
            break;
        }
      };

      admin.resetPassword = function(email) {
        var errorMsg = 'Error while resetting password';
        var email = email || admin.profile.id || '';
        if (email) {
          UsersAPI.resetPassword(email)
          .then(function() {
            admin.resetErrorMsg = '';
            admin.resetSuccessMsg = 'Reset link successfully sent';
          })
          .catch(function() {
            admin.resetErrorMsg = errorMsg;
          })
        } else {
          admin.resetErrorMsg = errorMsg;
        }
      };

      admin.setUserType = function() {
        UsersAPI.setUserType(admin.profile.id, admin.profile.userType)
        .then(function() {
          admin.profile.initialUserType = admin.profile.userType;
          admin.userTypeSuccessMsg = 'User type successfully changed';
          var index = _.indexOf(admin.filteredUsers, _.find(admin.filteredUsers, admin.userProfile));
          admin.userProfile.doc.userType = admin.profile.userType;
          admin.filteredUsers.splice(index, 1, admin.userProfile);
        })
        .catch(function(err) {
          admin.userTypeErrorMsg = err.message || 'Error while setting userType';
        });
      };

      function fillInUsers() {
        UsersAPI.getUsers()
          .then(handleUsers);
      };

      function handleUsers(resp){
        numberOfUsers = resp.total_rows;
        admin.usersArray = resp.rows;
        admin.usersArray = admin.usersArray.filter(function(user) {
          return !user.id.startsWith('_design/');
        })
        watchSearch(); 
      };

      function watchUserType() {
        $scope.$watch('admin.profile.userType', function (newVal, oldVal) {
          admin.userTypeSuccessMsg = '';
          if (admin.profile.initialUserType !== newVal) {
            admin.showSaveProfile = true;
          } else {
            admin.showSaveProfile = false;
          }
        }, true);
      };

      function watchSearch() {
        $scope.$watch('admin.searchUser', function (newVal, oldVal) {
          admin.filteredUsers1 = filterFilter(admin.usersArray, newVal);
          admin.totalItems = admin.filteredUsers1.length;
          watchPages();
        }, true);
      };

      function watchPages() {
        $scope.$watch('admin.currentPage + admin.numPerPage', function() {
          var begin = ((admin.currentPage - 1) * admin.numPerPage)
              , end = begin + admin.numPerPage;

          admin.filteredUsers = admin.filteredUsers1.slice(begin, end);
        });
      };


      // Orders

      admin.viewInvoice = function($event) {
        $event.stopPropagation();
      };

      admin.viewOrder = function(order) {
        OrdersAPI.setOrderToEdit(order.doc);
        $location.path('/order/' + order.doc._id);
      };

      function fillInOrders() {
        OrdersAPI.getOrders()
          .then(handleOrders);
      }

      function handleOrders(resp){
        if (resp) {
          admin.ordersArray = _.sortBy(resp.rows, function(item) {
            return new Date(item.doc.sentDate).getTime()*-1;
          });
          admin.ordersArray.forEach(function(order) {
            order.doc.date = order.doc.sentDate ? $filter('date')(order.doc.sentDate, 'mediumDate') : 'Date not set';
            order.doc.userID = order.doc.userID && order.doc.userID !== -1 ? order.doc.userID : 'User not set';
            order.doc.orderNum = order.doc.orderNum && order.doc.orderNum !== 'OrderNumNotSet' ? order.doc.orderNum : 'Number not set';
            order.doc.paymentStatus = order.doc.paymentStatus ? order.doc.paymentStatus : 'No status';
          })

          watchOrdersSearch();
        }
      }

      function watchOrdersSearch() {
        $scope.$watch('admin.searchOrder', function (newVal, oldVal) {
          admin.filteredOrders1 = filterFilter(admin.ordersArray, newVal);
          admin.totalOrderItems = admin.filteredOrders1.length;
          watchOrdersPages();
        }, true);
      }

      function watchOrdersPages() {
        $scope.$watch('admin.currentPage + admin.numPerPage', function() {
          var begin = ((admin.currentPage - 1) * admin.numPerPage)
          , end = begin + admin.numPerPage;

          admin.filteredOrders = admin.filteredOrders1.slice(begin, end);
        });
      }
    }
})();
