sync.controller('previewController',
 [
	'$scope','pdfDelegate','$timeout','$stateParams','$rootScope','$exceptionHandler','Files', 'FileSaver','Blob',function (
		$scope,pdfDelegate,$timeout,$stateParams,$rootScope,$exceptionHandler,Files,FileSaver, Blob) {

      //get mime type of anyFile that comes in my hood!

      

      if($stateParams.preview && $stateParams.extension == 'pdf'){
        $scope.previewable = true;
        try {
            //a user StrimUp is injected in bellow url it should be dynamic in future!
            $scope.pdfUrl = $rootScope.endPoint+ '/preview/'+ $stateParams.preview+'/of/'+'StrimUp';

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
      //this option down here of downloading a file was nice but still have some drowback

      // $scope.download = function(file_name){

      //   Files.downloadFile(file_name)
      //   .then(function(file_writen){
            
      //     Files.getMimeType($stateParams.preview)
      //       .then(function(mimeType){

      //         var blob = new Blob([file_writen], {
      //             type: mimeType,
      //         });
      //         FileSaver.saveAs(blob, $stateParams.preview);

      //       },function(err){
      //         console.log(err);
      //       });

          

      //   },function(err){
      //     console.log(err);
      //   });
      // };
      $scope.goPrev = function(page){
          pdfDelegate.$getByHandle('my-pdf-container').prev($scope.increment-1);
      };
}]);

sync.directive('fileDownload', [function () {
        return {
            restrict: 'A',
            replace: true,
            template: '<button class="btn btn-default" data-ng-click="download()"><span class=""></span>Download</button>',
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

                $scope.download = function () {
                    $scope.progress = 0;
                    $.fileDownload('http://syncme.com:8000/api/v1/files/download/phpxFnlheDVE5j5mcVDX.png/of/StrimUp?access_token=Bc7DWS7KKRLtxmddUZI1T1lZu2J1YhR8OLXGWNZn', { prepareCallback: prepare, successCallback: success, failCallback: error });
                }
            }]
        }
}]);
