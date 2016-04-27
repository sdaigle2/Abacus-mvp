'use strict';

describe('Service: UserService', function () {

    // load the service's module
    beforeEach(module('abacuApp'));

    var FrameCtrl;
    var scope;
    var fakeFrameData = {
        frames: [
            {
                frameID: 1,
                measures: [
                    {
                        measureID:1
                    },
                    {
                        measureID:2
                    }
                ]
            },
            {
                frameID: 2,
                measures: [
                    {
                        measureID:3
                    }
                ]
            }
        ]
        };

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        FrameCtrl = $controller('FrameCtrl', {
            $scope: scope, FrameData: fakeFrameData
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.employees.length).toBe(4);
    });
});
