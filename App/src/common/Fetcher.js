sync.service('Fetcher',['$http','$q','$rootScope',function Files ($http,$q,$rootScope) {
    this.fetch = function(object){
      var differed = $q.defer();
      //down endpoint return all files I own
      $http.get($rootScope.endPoint +'/api/v1/?+query='+'query+FetchUsers'+object)
      .success(function(response){
          differed.resolve(response);
      })
      .error(function(error) {
          differed.reject(error);
      })
      return differed.promise;
    };
}]);
