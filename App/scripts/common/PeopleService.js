sync.service('People', ['$q','$http','$rootScope',function ($q, $http, $rootScope) {
	this.get  = function (){
		var differed = $q.defer();
		$http.get($rootScope.endPoint + '/api/v1/suggestions')
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.reject(error);
		})
		return differed.promise;
	}
	this.allIfollow = function () {
		var differed = $q.defer();
		$http.get($rootScope.endPoint + '/api/v1/me/followings')
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		})
		return differed.promise;
	}
	this.unFollow = function(id){
		var differed = $q.defer();
		$http.delete($rootScope.endPoint + '/api/v1/me/following/' +id)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		})
		return differed.promise;
	}
	this.follow = function(param){
		var differed = $q.defer();
		$http.put($rootScope.endPoint + '/api/v1/me/followings', param)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error){
			differed.reject(error);
		})
		return differed.promise;
	}
	return this;
}]);
