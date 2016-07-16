/* global $window */
/* global Logger */

Logger.controller('loginController',['$scope','$http','$rootScope','$window', function ($scope,$http,$rootScope,$window) {
    var options = {
        'crededential-not-found'       : 'Credentials not found!',
        'success'                      : 'logging in...'
    };
  $scope.login = function (info)
  {
    //before notify that we are loggingin
    $('.login-form-main-message').addClass('show success').html(options['success']);
    $http.post($rootScope.endPoint + '/sessions',info)
    .success(function(response){
        console.log(response);
        if(response ==="1"){
            Redirecting();

        }else if(response === "0"){
             $('.login-form-main-message').addClass('show error').html(options['crededential-not-found']);
        }else if(response === "notVerified"){
            notVerified();
        }
    })
    .error(function(error) {
        console.log('error:'+ error);
    })
    function notVerified(){
         $window.location.href = '/notVerified';
    }
    function Redirecting(){
        $window.location.href = '/Home';
    }
  }
}]);
