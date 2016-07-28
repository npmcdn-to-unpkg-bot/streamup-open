angular.module('sync').service('SMS',['$http','$q','$rootScope',function($http,$q,$rootScope){
  this.send  = function(message){
    var differ = $q.defer();
    $http.post($rootScope.endPoint + '/api/v1/messages/send',message)
    .success(function(response){
      differ.resolve(response);
    },function(err){
      differ.reject(err);
    });
    return differ.promise;
  };
  return this;
}]);
