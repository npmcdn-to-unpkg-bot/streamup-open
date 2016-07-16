var sync = angular.module('sync', ["ui.bootstrap","ui.router"]);

sync.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider,$scope){

          $stateProvider
          .state('Home', {
            url: "/Files",
            templateUrl: 'files.html',
            controller: '',
          });
          $urlRouterProvider.otherwise('/Files');
}]);
