var sync = angular.module('sync', ["ui.bootstrap","ui.router"]);
sync.run(['$rootScope',function($rootScope){
      // $rootScope.endPoint='https://streamupbox.com';
      $rootScope.endPoint='http://localhost:8000';
}]);
sync.config(['$sceProvider','$httpProvider',function($sceProvider,$httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    //set authorization  oauth2.0 for protection

    $httpProvider.defaults.headers.common['authorization'] = 'Bearer 8EuqcMNkF2yP50Dicpv9hLRRp7WOSabPlCu22liY';


    $httpProvider.defaults.useXDomain = true;
    $sceProvider.enabled(false);

    // cfpLoadingBarProvider.includeBar = false;
}]);
sync.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider,$scope){
    $stateProvider
    .state('Home', {
      url: "/Login",
      templateUrl: 'login.html',
      controller: 'loginController',
    });
    $urlRouterProvider.otherwise('/Login');
}]);
