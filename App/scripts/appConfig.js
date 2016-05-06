// --Author Muragijimana Richard <beastar457@gmail.com>
// var sync = angular.module("sync", ["ngRoute","angularFileUpload","ionic","ngResource","ui.bootstrap","infinite-scroll"]);
angular.module('AuthManager',[]).service('SessionService', [function(){
    var userIsAuthenticated = false;

    this.setUserAuthenticated = function(value){
        userIsAuthenticated = value;
    };

    this.getUserAuthenticated = function(){
        return userIsAuthenticated;
    };
}]);

var sync = angular.module("sync", ["ngRoute","angularFileUpload","ui.bootstrap","ui.router","infinite-scroll",'ngMaterial', 'ngMessages', 'material.svgAssetsCache','ng-mfb','pdf','ngContextMenu','angular-loading-bar','ngFileSaver','AuthManager','ngDialog']);


var Logger=angular.module("Logger",[]);
Logger.run(['$rootScope',function($rootScope){

      // $rootScope.endPoint='https://streamupbox.com';
      $rootScope.endPoint='http://syncme.com:8000';
}]);
window.routes =
{
    "/Files": {
        url: "/Files",
        templateUrl: 'views/files.html',
        controller: 'FilesController',
        requireLogin: true
      },
      "preview":{
        url: '/!/:preview/:extension/:of/:user',
        templateUrl: 'views/filePreview.html',
        controller : 'previewController'
      },

      "/Groups": {
          url: "/Groups",
          templateUrl: 'views/groups.html',
          controller: 'GroupController',
          requireLogin: true
      }
};


sync.run(['$rootScope','$log',function($rootScope,$log){
  $rootScope.endPoint='http://syncme.com:8000';
   // $rootScope.endPoint='https://streamupbox.com';


  $rootScope.$on('$routeChangeStart',function(event, next, current){
    for(var i in window.routes) {

        if(next.indexOf(i) != -1) {
            if(window.routes[i].requireLogin && !SessionService.getUserAuthenticated()) {
                alert("You need to be authenticated to see this page!");
                event.preventDefault();
            }
        }

    }
  });
}]);
sync.provider({

    $exceptionHandler: function(){
        var handler = function(exception, cause) {
          console.log(exception);

        };

        this.$get = function() {
            return handler;
        };
    }
});
sync.config(['$sceProvider','$httpProvider','$mdThemingProvider','cfpLoadingBarProvider',function($sceProvider,$httpProvider,$mdThemingProvider,cfpLoadingBarProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    //set authorization for oauth2.0 for protection

    $httpProvider.defaults.headers.common['authorization'] = 'Bearer Bc7DWS7KKRLtxmddUZI1T1lZu2J1YhR8OLXGWNZn';

    $httpProvider.defaults.useXDomain = true;
    $sceProvider.enabled(false);

    cfpLoadingBarProvider.includeBar = false;
}]);
sync.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider,$scope){
        // $parseProvider.unwrapPromises(true) ;

          for(var path in window.routes) {

              // if(next.indexOf(path) != -1) {
              //     if(window.routes[path].requireLogin && !SessionService.getUserAuthenticated()) {
              //         alert("You need to be authenticated to see this page!");
              //         event.preventDefault();
              //     }
              // }
              $stateProvider.state(path, window.routes[path]);
          }

          $urlRouterProvider.otherwise('/Files');

        // $urlRouterProvider.otherwise('/Files');
        // $stateProvider.
        // state('/Feeds', {
        //   url: "/Feeds",
        //   templateUrl : 'views/feeds.html',
        //   controller  : 'PostingController'
        // })
        // .state('/Groups', {
        //   url: "/Groups",
        //   templateUrl: 'views/groups.html',
        //   controller: 'GroupController'
        // })
        //
        // .state('/Upload', {
        //   url: "/Upload",
        //   templateUrl: 'views/Upload.html',
        //   controller: 'UploadController'
        // })
        // .state('/Files', {
        //   url: "/Files",
        //   templateUrl: 'views/files.html',
        //   controller : 'FilesController'
        //
        // })
        //
        // .state('preview', {
        //     url: '/!/:preview/:extension/:of/:user',
        //     templateUrl: 'views/filePreview.html',
        //     controller : 'previewController'
        //   })
        //
        // .state('/People', {
        //   url: "/People",
        //   templateUrl: 'views/people.html',
        //   controller: 'PeopleController'
        // })
        //
        // .state('/Notifications', {
        //   url: "/Notifications",
        //   templateUrl: 'views/notifications.html',
        //   controller: 'notificationController'
        // })
        // .state('/Settings', {
        //   url: "/Settings",
        //   templateUrl: 'views/settings.html',
        //   controller: 'SettingsController'
        // });

}]);
//-----------------------done with Muragijimana Richard <beastar457@gmail.com>---------------//
//-----------------------deal with user's actions and interaction with other users---------------//
