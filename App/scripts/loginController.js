/* global $window */
/* global Logger */

sync.controller('loginController',['$scope','$http','$rootScope','$window','User', function ($scope,$http,$rootScope,$window,User) {
    var init = function() {
        
        getData();
    };
    var getData =function(){
        User.getUsername()
        .then(function(user){
            $scope.user = user;
            console.log(user);
        },function(err){
            console.log(err);
        });
    };
    init();
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
