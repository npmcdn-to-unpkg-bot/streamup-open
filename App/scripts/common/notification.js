/* global sync */
angular.module('sync').service('Notification', ['$http', '$q', '$rootScope', function Notification($http, $q, $rootScope) {
    this.getNotification = function (user_id) {
        var differed = $q.defer();
        $http.get($rootScope.endPoint + '/api/v1/notifications', {cache: false})
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            })
        return differed.promise;
    }
    this.createNotification = function (Notification) {
        var differed = $q.defer();
        $http.post($rootScope.endPoint + '/api/v1/notifications', Notification)
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
        return differed.promise;
    }
    this.deleteNotification = function (notification) {
        var differed = $q.defer();
        $http.delete($rootScope.endPoint + '/api/v1/notifications/' + notification)
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            })
        return differed.promise;
    }

    return this;
}]);

angular.module('sync').controller('notificationController', ['$scope','Notification','$log', function ($scope,Notification,$log) {
    $scope.init = function(){
        $scope.getNotification();
    }
    $scope.clearNotification = function(notification){


      Notification.clearNotification(notification)
      .then(function(response){
        //load remaining notification
        $scope.getNotification();
      },function(err){
        console.log(err);
      });
    }
    $scope.getNotification = function(){
        Notification.getNotification()
        .then(function(result){
            // $log.info(result);
            $scope.notifications = result;
            
        },function(error){
            // $log.info(error);
        });
    }
    $scope.init();
}]);
angular.module('sync').directive('notify',[function(){
  return{
    restrict:'AE',
    scope:{

    },
    link: function(scope, el, iAttrs){
      setTimeout(function(){
              var title='This will be title';
              var desc='Most popular article.';
              var url='sync.com:8000';
              notifyBrowser(title,desc,url);
          }, 2000);
          document.addEventListener('DOMContentLoaded', function (){
                if (Notification.permission !== "granted"){
                  Notification.requestPermission();
            }
      });

      function notifyBrowser(title,desc,url)
      {
        if (!Notification) {
            console.log('Desktop notifications not available in your browser..');
        return;
        }
        if (Notification.permission !== "granted"){
          Notification.requestPermission();
        }
        else {
          var notification = new Notification(title, {
            icon:'https://lh3.googleusercontent.com/-aCFiK4baXX4/VjmGJojsQ_I/AAAAAAAANJg/h-sLVX1M5zA/s48-Ic42/eggsmall.png',
            body: desc,
        });
        // Remove the notification from Notification Center when clicked.
        notification.onclick = function () {
            window.open(url);
        };
        // Callback function when the notification is closed.
        notification.onclose = function () {
          console.log('Notification closed');
        };
        }
      }
    }
  }
}])
