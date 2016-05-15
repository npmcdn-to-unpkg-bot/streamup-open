/* global $uibModalInstance */
/* global ModalInstanceCtrl */
/* global $uibModal */
/* global sync */
/* global sync */
sync.controller('FilesController',
 [
	'$scope','Files','$log','$window','User','$uibModal','$interval','pdfDelegate','$timeout','$stateParams','$rootScope','$exceptionHandler','Fetcher', function (
		$scope, Files,$log,$window,User,$uibModal,$interval,pdfDelegate,$timeout,$stateParams,$rootScope,$exceptionHandler,Fetcher) {

	  $scope.init = function(){
      // alert('here I am called');

      //load all box files
		    $scope.all();
        $scope.crazy();
	  };


	  // $interval(function () {
			// $scope.all();
   //  }, 8000);

   $scope.crazy = function(){
      var users='{users{email,id}}';

      Fetcher.fetch(users)
      .then(function(res){
        $scope.crazy  = res;
        console.log(res);

      }, function(error){
        console.log(error);

      })
    };
	 $scope.all = function(){
    $scope.dataLoading = true;
		Files.getBoxFiles()
			.then(function(res){

				$scope.files 	=	res;
        // console.log(res);
			}, function(error){
				console.log(error);
			})
      .finally(function () {
          $scope.dataLoading = false;
     });
	 };
  $scope.fileType  = function(type) {

      switch (type) {
        case 'pdf':
          return 'img/pdf.png';
          break;
        case 'folder':
          return 'img/universal_folder.png';
          break;
        case 'folder+':
          return 'img/Add_folder.png';
          break;
        case 'php':
          return 'img/code.png';
          break;
        case 'txt':
        return 'img/code.png';
        break;
        case 'docx':
          return 'img/word.png';
        case 'jpg':
          return 'fa fa-image';
          break;
        case 'png':
          return 'img/video.png';
          break;
        case 'jpeg':
            return 'img/universal_folder.png';
          break;
        case 'zip':
         return 'img/zip.png';
         break;
        default:
        return 'img/universal_folder.png';
      }
  };

	$scope.init();
}]);

sync.directive('draggable', function() {

     return {
        restrict: 'AE',
        link: function (scope, element, attr) {
           var el = element[0];

            el.draggable = true;

            el.addEventListener(
                'dragstart',
                function(e) {
                  // console.log('drag event started');
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('Text', this.id);
                    this.classList.add('drag');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragend',
                function(e) {
                    // console.log('drag event released');
                    this.classList.remove('drag');
                    return false;
                },
                false
            );
        }
    };
});


sync.controller('DragDropCtrl', ['$scope','Files','$interval',function($scope,Files,$interval) {


    $scope.handleDrop = function() {
      // 1)if moved only when it reach on folder allow move
      // 2)take th id of file moved and take id of folder move file into folder

       //move the item into where it is droped
       //the first thing here is to recalculate the array to keep the arrangement intact


    }
}]);
