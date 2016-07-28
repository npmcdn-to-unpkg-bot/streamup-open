/* global $uibModalInstance */
/* global ModalInstanceCtrl */
/* global $uibModal */
/* global angular.module('sync') */
/* global angular.module('sync') */

angular.module('sync').controller('SubFolderController',['$scope','SubFolder','User','DEBUG','$stateParams','$interval', function($scope,SubFolder,User,DEBUG,$stateParams,$interval){
  $scope.folderName= $stateParams.folderName;
  $scope.newfolder={};
  $scope.newfolder.folderId= $stateParams.id;
  // console.log($scope.folderName);
  var init = function(){
    getuser();
    getSubFolders();
  };
  var getSubFolders = function(){
      
      SubFolder.getSubFolders()
      .then(function(subfolders){
        // console.log(subfolders);
        $scope.subfolders = subfolders;
        
      },function(err){
        if(DEBUG == true)
            console.log(err);
      })
  };
   $interval(function () {
    getSubFolders()
  }, 1000);
  var getuser = function(){
      User.getUserId()
      .then(function(response){
          $scope.user_id=response;
      }).catch();
  };
  $scope.saveSubfolder = function(newfolder){
      
      SubFolder.createSubFolder(newfolder)
      .then(function(response){
        if(response.SubfolderCreated == false){
          notie.alert(3, 'Sub Folder  exist!', 2);
        }else{
         notie.alert(4, 'Sub Folder created successfull.', 2);
        }
      
          //$scope.success = response.message;
          //console.log('here');
          console.log(response);
      },function(err){

        //$scope.errors = err;
        if(DEBUG == true)
              // notie.alert(3, 'Folder already exist. Please Change folder name!.', 2);
            //$scope.errors = err.message;
              console.log(err);

      });
  };

  init();

}]);



angular.module('sync').controller('FolderController',['$scope','Folder','User','DEBUG','$interval', function($scope,Folder,User,DEBUG,$interval){
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
  var init = function(){
    getuser();
    getFolders();
  };
  var getFolders = function(){
      Folder.getFolders()
      .then(function(folders){
        $scope.folders = folders;

      },function(err){
        if(DEBUG == true)
            console.log(err);
      })
  };
  $interval(function () {
    getFolders()
  }, 1000);
  var getuser = function(){
      User.getUserId()
      .then(function(response){
          $scope.user_id=response;
      }).catch();
  };
  $scope.savefolder = function(newfolder){

      Folder.createFolder(newfolder)
      .then(function(response){
        if(response.folderCreated == false){
          notie.alert(3, 'Folder  exist!', 2);
        }else{
         notie.alert(4, 'Folder created successfull.', 2);
        }

      },function(err){

        if(DEBUG == true)
              console.log(err);

      });
  };
  init();
}]);
angular.module('sync').controller('FilesController',
 [
	'$scope','Files','$log','$window','User','$uibModal','$interval','pdfDelegate','$timeout','$stateParams','$rootScope','$exceptionHandler', function (
		$scope, Files,$log,$window,User,$uibModal,$interval,pdfDelegate,$timeout,$stateParams,$rootScope,$exceptionHandler) {
	  $scope.init = function(){
      //load all box files
		    $scope.all();
	  };
    $scope.getSelectedfilesIncluding = function(list, item) {
      item.selected = true;
      return list.files.filter(function(item) { return item.selected; });
    };
     $scope.models = {
       selected: null,
       lists: { "A": [], "B": [] }
   };
   // Generate initial model
   for (var i = 1; i <= 3; ++i) {
       $scope.models.lists.A.push({ label: "Item A" + i });
       $scope.models.lists.B.push({ label: "Item B" + i });
   }
   // Model to JSON for demo purpose
   $scope.$watch('models', function (model) {
       $scope.modelAsJson = angular.toJson(model, true);
   }, true);

    $scope.onDragstart = function(list, event) {
      console.log(list);
       list.dragging = true;
       if (event.dataTransfer.setDragImage) {
         var img = new Image();
         img.src = '/img/ic_content_copy_black_24dp_2x.png';
         event.dataTransfer.setDragImage(img, 0, 0);
       }
    };
    $scope.onDrop = function(list, files, index) {

    }
    $scope.onMoved = function(list) {
      // list.files = list.files.filter(function(item) { return !item.selected; });
    };
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

angular.module('sync').directive('draggable', function() {

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

angular.module('sync').directive('droppable', ['userInteractionNotification','Files',function(userInteractionNotification,Files) {
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
                    if (e.stopPropagation) e.stopPropagation();
                    this.classList.remove('over');
                    var binId = this.id;
                    var item = document.getElementById(e.dataTransfer.getData('Text'));
                    try{
                        this.appendChild(item);
                        scope.$apply(function(scope) {
                            var fn = scope.drop();
                            if ('undefined' !== typeof fn) {
                              fn(item.id, binId);
                            }
                        });
                        return false;
                    }catch(e){
                    }
                },
                false
        );
        }
    }
}]);
angular.module('sync').controller('DragDropCtrl', ['$scope','Files','$interval',function($scope,Files,$interval) {
    $scope.handleDrop = function() {
      
    }
}]);
