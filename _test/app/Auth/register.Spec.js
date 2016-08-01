describe('TestApp   ', function () {
	beforeEach(module('ngResource',function($provider,$controllerProvider) {
        $controllerProvider.register('RegisterController',function($scope) {
            
        });
    }));
     
    beforeEach(module('sync'));
  
    it('should work now',function() {
        expect(1+1).toBe(2);
        
    });
});
