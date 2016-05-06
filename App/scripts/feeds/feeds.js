/* global sync */
/**
 *  Created by Muragijimana Richard on 10/20/15.
 *  Beastar457@gmail.com , sync@gmail.com , check with me!
 */
/*I use CamelCase while renaming my functions */
/*and i use snake case while renaming variables */
/*post service */

sync.service('Post', ['$http', '$q', '$rootScope', function Post($http, $q, $rootScope) {
    this.getPost = function (user_id) {
        var differed = $q.defer();
        $http.get($rootScope.endPoint + '/api/v1/me/posts?user_id' + user_id, {cache: false})
            .success(function (response) {

                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
        return differed.promise;
    };
    this.participate = function(obj){
      var differed = $q.defer();
      $http.put($rootScope.endPoint + '/api/v1/me/posts/',obj)
      .success(function(response){
        differed.resolve(response);
      })
      .error(function(err){
        differed.reject(err);
      });
      return differed.promise;
    };
    this.createPost = function (post) {
        var differed = $q.defer();
        $http.post($rootScope.endPoint + '/api/v1/me/posts', post)
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
        return differed.promise;
    };
    this.deletePost = function (id) {
        var differed = $q.defer();
        $http.delete($rootScope.endPoint + '/api/v1/me/posts/' + id)
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
        return differed.promise;
    };
    return this;
}]);

sync.controller('PostingController', [
  '$scope',
  'Post',
  '$timeout',
  'User',
  '$interval',
  'Notification',
  // '$ionicListDelegate',
  '$log',
  'userInteractionNotification',
  function (
  $scope,
  Post,
  $timeout,
  User,
  $interval,
  Notification,
  $ionicListDelegate,
  $log,
  userInteractionNotification
) {

    $scope.init = function () {
        $scope.postLoader();
        $scope.getUser();

    };

    $interval(function () {
        $scope.postLoader();
    }, 8000);
    $scope.getUser =function(){

      User._id()
      .then(function(response){

        $scope.user = response;
        console.log(response);
      },function(err){
        //quit slintly
      });
    };
    $scope.loadMore = function(){

    };
    $scope.participateIntoPost = function(post,user){
      // console.log(user);
      var obj ={
        'post_id':post,
        'user_id':user
      };
      Post.participate(obj)
      .then(function(response){
        $scope.postLoader();
      },function(err){
        //quit slently

      });
    };
    $scope.postLoader = function () {
        $scope.dataLoading = true;
        Post.getPost()
            .then(function (tree) {

                $scope.posts =tree;
                //navigate trough tree response which is require much attention
                $scope.friends=[];
                $scope.replies=[];
                for (var i = 0; i < tree.length; i++) {
                    if (tree[i].hasOwnProperty('friends') && tree[i]['replies']  && tree[i]['friends'] ) {
                      $scope.friends.push(tree[i].friends);
                      $scope.replies.push(tree[i].replies);
                    } else if (tree[i].hasOwnProperty('friends')) {
                        $scope.friends = friends.concat(traverse(tree[i].friends));
                        $scope.replies = replies.concat(traverse(tree[i].replies));
                    }
                }
            }, function (error) {
        });
    };
    $scope.imageDesc = function(index){
      //show images with different pixel
      switch (index) {
        case 0:
          return '60px';

          case 1:
            return "60px";

          case 2:
            return "60px";

          case 3:
            return "60px";

          case 4:
            return "60px";

        default:
        return "60px";

      }
      console.log(index);
    };
    $scope.share = function(id){
        $ionicListDelegate.closeOptionButtons();
        $log.info(id);
    };
    $scope.createPost = function (posting) {
      //if image is uploaded uploaded
        var _this = { message: posting };
        Post.createPost(_this)
            .then(function (postCreated) {
                  $scope.message = '';
                  $scope.posts.push(postCreated);
                  userInteractionNotification.success("New Post feed created!");
            }, function (error) {

            });
    };

    $scope.init();
}]);
sync.directive('feedsUploader',[function(){
  return {
    restrict: 'AE',
    replace: false,
    templateUrl: 'App/js/scripts/views/feedAttachment.html',
    scope: {
      action: '@'
    },
    controller: ['$scope', function ($scope) {
      $scope.progress = 0;
      $scope.avatar = '';
      $scope.sendFile = function(el) {
        var $form = $(el).parents('form');
        if ($(el).val() === '') {
          return false;
        }
        $form.attr('action', $scope.action);
        $scope.$apply(function() {
          $scope.progress = 0;
        });
        $form.ajaxSubmit({
          type: 'POST',
        	beforeSend: function (xhr) {
        		xhr.setRequestHeader('authorization', 'Bearer OqFirQS44RQTjRuWniXjdHZJQXdCuEx49rq8JY5A');
        	},
          uploadProgress: function(evt, pos, tot, percComplete) {
            $scope.$apply(function() {
              // upload the progress bar during the upload
              // $scope.progress = percentComplete;
            });
          },
          error: function(evt, statusText, response, form) {
            // remove the action attribute from the form
            $form.removeAttr('action');
          },
          success: function(response, status, xhr, form) {
            var ar = $(el).val().split('\\'),
              filename =  ar[ar.length-1];
            // remove the action attribute from the form
            $form.removeAttr('action');
            $scope.$apply(function() {
              $scope.avatar = filename;
            });
          },
        });
      };
    }],
    link: function(scope, elem, attrs, ctrl) {

      elem.find('.fake-uploader').click(function() {
        elem.find('input[type="file"]').click();
      });

    }
  };
}]);
