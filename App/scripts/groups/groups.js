/* global Files */
/* global angular.module('sync') */
/* global $scope */
/* global angular */
/*Author Muragijimana Founder & CEO of angular.module('sync') call him on StrimUp@gmail.com*/

angular.module('sync').service('Group', [
	'$http',
	'$rootScope',
	'$q',function Group (
		$http,
		$rootScope,
		$q) {
	this.create 		=	function(name){
		var differed 	=	$q.defer();
		$http.post($rootScope.endPoint + '/api/v1/me/groups', name)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.reject(error);
		})
		return differed.promise;
	}
	this.delete 		=	function(id){
		var differed 	=	$q.defer();
		$http.delete($rootScope.endPoint + '/api/v1/me/groups/'+id)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.reject(error);
		})
		return differed.promise;
	}
	this.myGroups		=	function(){
		var differed 	=	$q.defer();

		$http.get($rootScope.endPoint + '/api/v1/me/groups')
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			console.log('differed slow:' + error);
			differed.reject(error);
		})
		return differed.promise;
	}

	this.addPeople 	=	function(member){
		var differed 	=	$q.defer();
		$http.put($rootScope.endPoint + '/api/v1/me/groups/'+JSON.stringify(member))
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.resolve(error);
		})
		return differed.promise;
	};
	this.addFileToGroup = function(fileObj){
		var differed = $q.defer();
		$http.put($rootScope.endPoint + '/api/v1/me/groups/'+ JSON.stringify(fileObj))
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		})
		return differed.promise;
	}
	this.removePeople 	=	function(member){
		var differed 	=	$q.defer();
		$http.put($rootScope.endPoint +'/api/v1/me/groups/'+JSON.stringify(member))
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.reject(error);
		})
		return differed.promise;
	}
  this.suggestPeople = function(id){

    	var differed = $q.defer();
    	$http.get($rootScope.endPoint + '/api/v1/me/groups/' + id)
    	.success(function(res){
    		differed.resolve(res);
    	})
    	.error(function(err) {
    		differed.reject(err);
    	})
    	return differed.promise;
    }
	return this;
}]);

angular.module('sync').controller('GroupController', [
	'$scope',
	'Group',
	'User',
	'Files',
	'userInteractionNotification',
	function GroupController (
		$scope,
		Group,
		User,
		Files,
		userInteractionNotification
	) {
	$scope.init 	=	function(){
		$scope.myGroups();

		$scope.suggestedPeopleToGroup();//ofcause they are arleady your friend but not participant in your stuff work!
	}
	$scope.userId 				=	function(){
		User._id()
		.then(function(response){
			$scope.userId 	=	response;
		}, function(error){
			console.log(error);
		});
	};
	$scope.myGroups 			=	function(){
		Group.myGroups()
		.then(function(response){
			$scope.group 	= response;
		}, function(error){
		});
	};
	$scope.suggestedPeopleToGroup 	=	function(id){
		//clearing all view rendered before
		$scope.showFiles=false;
		$scope.showGroup=false;
		$scope.showBox=false;
		if(!angular.isUndefined(id)){
			Group.suggestPeople(id).then(function(response){
				// console.log(response);
				$scope.followers = response;
			}, function(error){
				console.log(error);
			});
		}
	};
	$scope.$on('refreshGroup',function(){
       $scope.init();
  	});
	$scope.$on('groupDeleted', function (event, args) {
		event.preventDefault();
		$scope.myGroups();
	});
	$scope.$on('groupTobindwith', function (event, groupid) {
		event.preventDefault();
        $scope.emitted =groupid;
        if( $scope.showFiles == true){
            $scope.showFiles=false;
        }
        $scope.suggestedPeopleToGroup(groupid);
        $scope.addPeople=true;
	});
	$scope.getGroupFiles = function(owner){
    Files.getGroupFiles(owner)
		.then(function(tree){
			$scope.files = tree;
				//navigate trough tree response which is require much attention
				$scope.groups=[];
				for (var i = 0; i < tree.length; i++) {
						if (tree[i].hasOwnProperty('groups') && tree[i]['groups']) {
								$scope.groups.push(tree[i].friends);
						} else if (tree[i].hasOwnProperty('groups')) {
								$scope.groups = groups.concat(traverse(tree[i].groups));
						}
				}
		}, function(error){
			console.log(error);
		});
  };
	$scope.getBoxFiles = function(groupId){
		$scope.emitted =groupId;
  	Files.getBoxFiles(groupId)
		.then(function(tree){
			$scope.files = tree;
				//navigate trough tree response which is require much attention
				$scope.groups=[];
				for (var i = 0; i < tree.length; i++) {
						if (tree[i].hasOwnProperty('groups') && tree[i]['groups']) {
								$scope.groups.push(tree[i].friends);
						} else if (tree[i].hasOwnProperty('groups')) {
				            $scope.groups = groups.concat(traverse(tree[i].groups));
						}
				}
		}, function(error){
			console.log(error);
		});
  };
$scope.$on('showOptions',function(_,params){
     if(params.owner ==="box"){
			 $scope.addPeople=false;
			 $scope.showGroup=false;
       $scope.showBox=true;
       if( $scope.addPeople == true){
           $scope.addPeople=false;
       }
			 //set files scope to show files of box files is repeated in view directive
       $scope.getBoxFiles (params.group_id);
		 }else if (params.owner === "group") {
			 $scope.showBox=false;
			 $scope.addPeople=false;
			 $scope.showGroup=true;
			 if( $scope.addPeople == true){
					 $scope.addPeople=false;
			 }
			 //change files to new scope files to show files of groups  is repeated in view directive
			 $scope.getGroupFiles (params.group_id);
		 }
});
$scope.init();
}]);
angular.module('sync').directive('myGroups', [
	'Group',
	'Report',
	'userInteractionNotification',
	function myGroups (
		Group,
		Report,
		userInteractionNotification,
		Notification) {
	return {
		priority: 10,
		templateUrl: 'App/scripts/js/directives/groups.html',
		restrict: 'E',
		scope: {
			  id: '=userId',
          groups: '=',
          followers: '=',
          emitted:'=',
          showPeople:'=',
          showGroup   :  '=',
          files   :  '=',
	  			showBox:  '='
		},
		link: function (scope, iElement, iAttrs) {
			scope.deleteGroup = function(id){
				Group.delete(id)
				.then(function(res){
						userInteractionNotification.info("Group deleted");
					 	scope.$emit("groupDeleted", 'group deleted');
				}, function(err){
					Report.send('delete group error:'+err)
					.then(function(){}, function(){});
				})
			};
      scope.createGroup	=	function(name){
          Group.create(name)
                  .then(function(response){
											userInteractionNotification.success("Created new Group");
                      scope.$emit('refreshGroup',null);
                  }, function(error){
                      console.log(error);
                  });
              };
			scope.initAddPeople = function(groupid){
				scope.$emit("groupTobindwith", groupid);
			};

			scope.addPeople = function(params){
				var newParams ={
					'option':'addMember',
					'userId':params.userId,
					'groupId':params.groupId
				}
				if(angular.isUndefined(params)){
					//won't happen!or if ti happen we quit
				}else{

					Group.addPeople(newParams)
					.then(function (response){
						//refresh group with new member status
							userInteractionNotification.success("Added Member in group.");
              scope.initAddPeople(params.groupId);
              scope.$emit('refreshGroup','');
              console.log(response);
					}, function (error,status){
              console.log(error);
					});
				}
			}
			scope.removePeople = function(params){

				var newParams ={
					'option':'removeMember',
					'userId':params.userId,
					'groupId':params.groupId
				}

				if(angular.isUndefined(params)){
					//won't happen!or if ti happen we quit too bad hierachy!
				}else{
				Group.removePeople(newParams)
					.then(function (response){
							userInteractionNotification.info("Removed Member in group.");
	            scope.initAddPeople(params.groupId);
	            scope.$emit('refreshGroup','');
            	console.log(response);
					}, function (error,status){
              console.log(error);
					});
				}
			};
			scope.removeFromGroup = function(){
				console.log('we can remove file in group');
			}
			scope.addFileToGroup = function(params){
				var fileObj ={
					'option':'addFiles',
					'fileId':params.fileId,
					'groupId':params.groupId
				}

				Group.addFileToGroup(fileObj)
				.then(function(response){
					console.log(response);
					// userInteractionNotification.success("A file is added in group");
				},function(err){
					userInteractionNotification.warn("Some error occured during adding file");
				})

			}
			scope.filesInBox = function(groupid){
				var params ={'group_id':groupid,'owner':'box'};
				scope.$emit('showOptions',params);

			}
			scope.filesInGroup = function(groupid){

				var params ={'group_id':groupid,'owner':'group'};
				scope.$emit('showOptions',params);
			}
		}
	};
}]);

angular.module('sync').service('Report', [function Report ($http,$q,$rootScope) {
	this.send = function(issue){
		var differed = $q.defer();
		$http.post($rootScope.endPoint + '/api/v1/issues', issue)
		.success(function(res){
			differed.resolve(res);
		})
		.error(function(err) {
			differed.reject(err);
		})
		return differed.promise;
	}
	return this;
}]);
