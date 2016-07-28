
describe('Controller: RegisterController', function() {
    var rootScope, scope, controller, httpBackend;

    beforeEach(module('sync'));

    beforeEach(inject(function($controller, $rootScope, $httpBackend) {
        httpBackend = $httpBackend;
        scope = $rootScope.$new();
        controller = $controller('RegisterController', { '$scope': scope });
        rootScope = $rootScope;
        scope.$digest();
    }));

    it('should work', function() {
        expect(scope).not.toEqual({});
    });

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });
});
