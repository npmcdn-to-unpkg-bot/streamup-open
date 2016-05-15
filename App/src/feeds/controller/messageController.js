//Author Muragijimana Richard strimup@gmail.com beastar457@gmail.com

  sync.controller('MessageController', function ($http,$scope,$q,$rootScope) {
       $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
      
         $scope.name="Muragijimana";
         var posts=$http.get($rootScope.endPoint + '/api/v1/post'),
             institutions=$http.get($rootScope.endPoint + '/api/v1/post');

          $q.all([posts,institutions]).then(function(result) {
            var tmp = [];
            angular.forEach(result, function(response) {
              tmp.push(response.data);
            });
            return tmp;
          }).then(function(tmpResult) {
              // posts=tmpResult;
              // console.log(angular.toJson(tmpResult[0], true));
            $scope.posts = tmpResult[0];
          });
         $('.post-in').atwho({
            at: "@",
            data:['Peter', 'Tom', 'Anne'],

         });

  });
