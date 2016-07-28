angular.module('sync').service('User', ['$http','$q','$rootScope',function Files ($http,$q,$rootScope) {
	this.getUserId = function(){
		var promise = $q.defer();
		$http.get($rootScope.endPoint +"/api/v1/users/id")
		.success(function(res){
			promise.resolve(res);
		})
		.error(function() {
			promise.reject();
		});
		return promise.promise;
	};
	this.postLogin = function(data) {
			var promise = $q.defer();
			$http.post($rootScope.endPoint +"/api/v1/users", data)
			.success(function(res){
				promise.resolve(res);
			})
			.error(function() {
				promise.reject();
			});
		return promise.promise;
	};
	this.getUsername = function(){
		var promise = $q.defer();
		$http.get($rootScope.endPoint +"/api/v1/users/username")
		.success(function(res){
			promise.resolve(res);
		})
		.error(function() {
			promise.reject();
		});
		return promise.promise;
	};
	this.doSignUp = function(data) {
		 var differed = $q.defer();
      $http.post($rootScope.endPoint + '/register')
      .success(function(response){
        differed.resolve(response);
      })
      .error(function(err){
        differed.reject(err);
      })
      return differed.promise;
	};
	this.groups = function(user){
      var differed = $q.defer();
      $http.get($rootScope.endPoint + '/api/v1/me/groups')
      .success(function(response){
        differed.resolve(response);
      })
      .error(function(err){
        differed.reject(err);
      })
      return differed.promise;
    };

	return this;
}])
