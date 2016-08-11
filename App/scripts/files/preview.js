angular.module('sync').controller('previewController',
 [
	'$scope','pdfDelegate','$timeout','$stateParams','$rootScope','$exceptionHandler','Files', 'FileSaver','Blob',function (
		$scope,pdfDelegate,$timeout,$stateParams,$rootScope,$exceptionHandler,Files,FileSaver, Blob) {

      if($stateParams.preview && $stateParams.extension == 'pdf'){
        $scope.previewable = true;
        try {
            //a user StrimUp is injected in bellow url it should be dynamic in future!
            $scope.pdfUrl = $rootScope.endPoint+ '/preview/'+ $stateParams.preview+'/of/'+$stateParams.user;
            $timeout(function() {
                pdfDelegate.$getByHandle('my-pdf-container').zoomIn(0.5);
            }, 3000);
        } catch (e) {

           throw( new Error(e))
        }
      }else if($stateParams.preview && $stateParams.extension == 'jpg'||$stateParams.extension == 'png'){
        $scope.file_name = $stateParams.preview;
        $scope.previewable = false;
        //as by now images are not ready to be previewed so set it to false!provide only option to download them!
          // $scope.previewable = false;
          // Files.single($stateParams.preview)
          // .then(function(response){
          //   $scope.imagePreview = response;
          // },function(err){
          //   console.log(err);
          // });
      }else {
        //send a filename to a download button
        $scope.file_name = $stateParams.preview;
        $scope.previewable = false;
      }

      $scope.goNext = function() {
          $scope.increment = 1;
          pdfDelegate.$getByHandle('my-pdf-container').next($scope.increment+1);
      };
      $scope.donwload="Download";
      $scope.goPrev = function(page){
          pdfDelegate.$getByHandle('my-pdf-container').prev($scope.increment-1);
      };
}]);

angular.module('sync').directive('fileDownload', ['User',function (User) {
        return {
            restrict: 'A',
            replace: true,
             scope: { obj: '=',name:'=' },
            template: '<span  data-ng-click="download(obj)">{{name}}</span>',
            controller: ['$rootScope', '$scope', '$element', '$attrs', '$timeout', function ($rootScope, $scope, $element, $attrs, $timeout) {
                $scope.progress = 0;
                function prepare(url) {
                    // dialogs.wait("Please wait", "Your download starts in a few seconds.", $scope.progress);
                    fakeProgress();
                }
                function success(url) {
                    $rootScope.$broadcast('dialogs.wait.complete');
                }
                function error(response, url) {
                    // dialogs.error("Couldn't process your download!");
                }
                function fakeProgress() {
                    $timeout(function () {
                        if ($scope.progress < 95) {
                            $scope.progress += (96 - $scope.progress) / 2;
                            // $rootScope.$broadcast('dialogs.wait.progress', { 'progress': $scope.progress });
                            fakeProgress();
                        }
                    }, 250);
                }
                User.getUsername()
                .then(function(user){
                  $scope.user = user;
                }).catch();
                $scope.download = function (file) {
                    $.fileDownload($rootScope.endPoint+'/downloads/file/'+file+'/of/'+$scope.user, { prepareCallback: prepare, successCallback: success, failCallback: error });
                }
            }]
        }
}]);
