/* global angular.module('sync') */
"use strict";
angular.module('sync').controller('PeopleController', ['$scope','People',function ($scope, People) {
		$scope.init = function(){
			$scope.getPeopleToFollow();
		}
		$scope.getPeopleToFollow  = function(){
			People.get()
			.then(function(response){
				
				$scope.people = response;
			}, function(error){

			})
		}
		$scope.$on('followMember',function(event,params){
			event.preventDefault();
			People.follow(params)
			.then(function(response){
				//console.log(response);
				$scope.getPeopleToFollow();
			},function(error){
				console.log(error);
			})
		});
		$scope.follow = function(id){
			var follow ={id: id, option:'addPeople'};
			$scope.$emit("followMember", follow);
		}
		$scope.init();
}]);
