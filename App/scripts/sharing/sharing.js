/* global angular.module('sync') */
angular.module('sync').controller('ShareController', [
	'$scope',
	'$rootScope',
	'$routeParams',
	'$route',
	'$log',
	'$uibModal',
	'Share',
	'User',
	function (
		$scope,
		$rootScope,
		$routeParams,
		$route,
		$log,
		$uibModal,
		Share,
		User
	)
{

	$scope.share = function(file_id){
		// alert('here');
		console.log(file_id);
	};
}
]);
