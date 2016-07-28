angular.module('sync').service('Share',['$log','$http','$q','$rootScope', function ($log,$http,$q,$rootScope) {
	this.share = function(sharebleObj){
		var differed = $q.defer();
        $http.post($rootScope.endPoint + '/api/v1/share',sharebleObj)
        .success(function(response){
            differed.resolve(response);
        })
        .error(function(err){
            differed.reject(err);
        });
        return differed.promise;
	};
	this.getUser = function(user){

		var differed = $q.defer();
		$http.get($rootScope.endPoint + '/api/v1/me/users/'+ user)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		});
		return differed.promise;
	};
	this.fileMime = function(file){
		var differed = $q.defer();
		$http.get($rootScope.endPoint + '/api/v1/mimeType/'+ file)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		});
		return differed.promise;
	};
    return this;
}]);