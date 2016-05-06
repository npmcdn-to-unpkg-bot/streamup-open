/* global $uibModalInstance */
/* global ModalInstanceCtrl */
/* global $uibModal */
/* global sync */
/* global sync */
sync.controller('FilesController',
 [
	'$scope','Files','$log','$window','User','$uibModal','$interval','pdfDelegate','$timeout','$stateParams','$rootScope','$exceptionHandler', function (
		$scope, Files,$log,$window,User,$uibModal,$interval,pdfDelegate,$timeout,$stateParams,$rootScope,$exceptionHandler) {

	  $scope.init = function(){
      //load all box files
		    $scope.all();
	  };


	  // $interval(function () {
			// $scope.all();
   //  }, 8000);


	 $scope.all = function(){
    $scope.dataLoading = true;
		Files.getBoxFiles()
			.then(function(res){
				$scope.files 	=	res;

			}, function(error){
				// console.log(error);
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

sync.directive('droppable', ['userInteractionNotification','Files',function(userInteractionNotification,Files) {
    return {
        scope: {
            drop: '&',
            bin: '='// parent
        },
        link: function(scope, element) {
            // again we need the native object
            var el = element[0];
            el.addEventListener(
              'dragover',
              function(e) {
                  e.dataTransfer.dropEffect = 'move';
                  // allows us to drop
                  
                  if (e.preventDefault) e.preventDefault();
                  this.classList.add('over');
                  return false;
              },
              false
          );
           el.addEventListener(
              'dragenter',
              function(e) {
                  this.classList.add('over');
                  return false;
              },
              false
          );

          el.addEventListener(
              'dragleave',
              function(e) {
                  this.classList.remove('over');
                  return false;
              },
              false
          ); 
          el.addEventListener(
            'drop',
                function(e) {
                    // Stops some browsers from redirecting.
                    if (e.stopPropagation) e.stopPropagation();

                    this.classList.remove('over');

                    var binId = this.id;
                    var item = document.getElementById(e.dataTransfer.getData('Text'));
                    // console.log('Item now is:'+item);
                    
                    
                    try{
                      // call the passed drop function
                        this.appendChild(item);
                        scope.$apply(function(scope) {
                            var fn = scope.drop();
                            if ('undefined' !== typeof fn) {
                              fn(item.id, binId);
                            }
                        });

                        return false;
                    }catch(e){
                      //throw error that happen when file is dropped in it's own location
                      //give some alert to notify what happned
                      // throw( new Error(e))
                      // userInteractionNotification.error("Drop File on folder to move it!");
                    }
                    
                },
                false
        );
        }
    }
}]);
sync.controller('DragDropCtrl', ['$scope','Files','$interval',function($scope,Files,$interval) {

  
    $scope.handleDrop = function() {
      // 1)if moved only when it reach on folder allow move
      // 2)take th id of file moved and take id of folder move file into folder

       //move the item into where it is droped
       //the first thing here is to recalculate the array to keep the arrangement intact
       
        
    }
}]);
