var sync = angular.module('sync', ["ui.bootstrap","ui.router"]);

sync.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider,$scope){
    $stateProvider
    .state('Home', {
      url: "/Login",
      templateUrl: 'login.html',
      controller: '',
    });
    $urlRouterProvider.otherwise('/Login');
}]);
