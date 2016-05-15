sync.service('Files', ['$http','$q','$rootScope',function Files ($http,$q,$rootScope) {
    this.getGroupFiles =function(groupId) {
        var differed = $q.defer();
        //down endpoint return all files I own
        $http.get($rootScope.endPoint +'/api/v1/groups/'+groupId+'/groupfiles')
        .success(function(response){
            differed.resolve(response);
        })
        .error(function(error) {
            differed.reject(error);
        })
        return differed.promise;
    };
    

    this.single = function(file){
      var promise = $q.defer();
      $http.get($rootScope.endPoint+ '/preview/'+ file)
      .success(function(response){
        promise.resolve(response);
      })
      .error(function(err){
        promise.reject(err);
      });
      return promise.promise;
    };
    this.getBoxFiles = function(){
        var groupId = 1;//by default this can be any number
        var differed = $q.defer();
        //the idea is to get a file either from groups or individual account group is optional
        $http.get($rootScope.endPoint + '/api/v1/files/'+groupId+'/boxfiles')
        .success(function(response){
          differed.resolve(response);
        })
        .error(function(err){
          differed.reject(err);
        });
        return differed.promise;
    };
    this.getMimeType = function(file_name){
      var promise = $q.defer();
      $http.get($rootScope.endPoint + '/api/v1/files/mimeType/'+ file_name)
      .success(function(response){
          promise.resolve(response);
      })
      .error(function(err){
          promise.reject(err);
      });
      return promise.promise;
    };
    this.downloadFile = function(file_name){

      var promise = $q.defer();
      //hard coded a user StrimUp! need to inject him dyamically
      $http.get($rootScope.endPoint+ '/api/v1/files/download/'+file_name+'/of/'+ 'StrimUp')
      .success(function(response){
        promise.resolve(response);
      })
      .error(function(err){
        promise.reject(err);
      });
      return promise.promise;
    };
    return this;
}]);
