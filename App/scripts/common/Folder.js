

angular.module('sync').service('Folder', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) 
	{


	   this.createFolder = function(name) {
        var promiss = $q.defer();
        $http.post($rootScope.endPoint +'/api/v1/folder',name)
            .success(function(response) {
                promiss.resolve(response);
            })
            .error(function(error) {
                promiss.reject(error);
            });
        return promiss.promise;
    }
    this.getFolders = function() {
        var promiss = $q.defer();
        $http.get($rootScope.endPoint +'/api/v1/folder/list')
            .success(function(response) {
                promiss.resolve(response);
            })
            .error(function(error) {
                promiss.reject(error);
            });
        return promiss.promise;
    }
    

  return this;
}]);