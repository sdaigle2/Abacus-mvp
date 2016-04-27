'use strict';

describe('Service: UserService', function () {

    // load the service's module
    beforeEach(module('abacuApp'));

    var AboutCtrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AboutCtrl = $controller('AboutCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.employees.length).toBe(4);
    });
});
