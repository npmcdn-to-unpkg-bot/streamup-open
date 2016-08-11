/* global angular.module('sync') */
angular.module('sync').service('Settings', ['$http','$rootScope','$q',function ($http,$rootScope,$q) {
	this.current = function(){
        var differed = $q.defer();
        $http.get($rootScope.endPoint + '/api/v1/settings')
        .success(function(resp){
            differed.resolve(resp);
        })
        .error(function(err){
            differed.reject(err);
        })
        return differed.promise;
    }
    return this;
}]);

angular.module('sync').controller('SettingsController', ['$scope','Settings','$log', function ($scope,Settings,$log) {
	$scope.init = function(){
        $scope.loadCurrentSettings();
    }
     $scope.loadCurrentSettings = function(){
         Settings.current().then(function(resp){
             $scope.settings = resp;
         }, function(err){
             $log.info('errror prevent promise to be fullfill');
         });
     }
     $scope.init();
}]);
