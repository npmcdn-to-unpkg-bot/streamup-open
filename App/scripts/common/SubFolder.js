sync.service('SubFolder', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) 
	{


	this.createSubFolder = function(name) {
        var promiss = $q.defer();
        $http.post($rootScope.endPoint +'/api/v1/subfolder',name)
            .success(function(response) {
                promiss.resolve(response);
            })
            .error(function(error) {
                promiss.reject(error);
            });
        return promiss.promise;
    };
    this.getSubFolders = function() {
        var promiss = $q.defer();
        $http.get($rootScope.endPoint +'/api/v1/subfolder/list')
            .success(function(response) 

            {
                promiss.resolve(response);
            })
            .error(function(error) {
                promiss.reject(error);
            });
        return promiss.promise;
    };
    

  return this;
}]);