
sync.controller('uploadDialogCtrl', ['$scope','$uibModal','$mdDialog','$mdMedia', function ($scope,$uibModal, $mdDialog, $mdMedia) {

				//declare global function for shortcut
				$scope.cancel = function() {
					$mdDialog.hide();
				};
		    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
		    $scope.upload = function(ev) {
		      $mdDialog.show({
						parent: angular.element(document.body),
		        controller: DialogController,
		        templateUrl: 'views/upload.tpl.html',
		        parent: angular.element(document.body),
		        targetEvent: ev,
		        clickOutsideToClose:false
		      })
		      .then(function(answer) {
		            $scope.status = 'You said the information was "' + answer + '".';
		          }, function() {
		            $scope.status = 'You cancelled the dialog.';
		          });
		    };
				function DialogController($scope, $mdDialog) {
				  $scope.hide = function() {
				    $mdDialog.hide();
				  };
				  $scope.cancel = function() {
				    $mdDialog.cancel();
				  };
				  $scope.answer = function(answer) {
				    $mdDialog.hide(answer);
				  };
				}
}]);
sync.controller('shareController', ['$scope','$uibModal','$mdDialog','$mdMedia','urlShortener','Share','User', function ($scope,$uibModal, $mdDialog, $mdMedia,urlShortener,Share,User) {

	//declare global function for shortcut
	$scope.cancel = function() {
		$mdDialog.hide();
	};
	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	$scope.share = function(ev,fileName) {

		$mdDialog.show({
			parent: angular.element(document.body),
			controller: DialogController,
			templateUrl: 'views/share.tpl.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:false
		})
		.then(function(answer) {
					$scope.status = 'You said the information was "' + answer + '".';
				}, function() {
					$scope.status = 'You cancelled the dialog.';
				});
				function DialogController($scope, $mdDialog) {
					// console.log('sharedFile'+ fileName);
					$scope.getFile = function(){
						return $scope.file=urlShortener.makeShort(fileName);
					};
					$scope.hide = function() {
						$mdDialog.hide();
					};
					$scope.cancel = function() {
						$mdDialog.cancel();
					};
					$scope.answer = function(answer) {
						$mdDialog.hide(answer);
					};
				}

	};



	$scope.shareFile = function(vm){

		var emails=vm.emails;
		var email_array = emails.split(',');
		var i;
		for ( i=0; i < email_array.length; i++ ) {
			//validate each email to share with
			Share.share(vm)
			.then(function(res){
				console.log(res);
			}).catch();
			// console.log(email_array[i]);

		}
	}

}]);
