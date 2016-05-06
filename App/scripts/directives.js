sync.directive('leftMenu',function(){
  return {
        restrict: 'AE',
        scope: {
            data: '=',
            user: '=',
            type: '='
        },
        templateUrl: "directives/leftMenu.html"
    };
});
sync.directive('feeds',function(){
  return {
        restrict: 'AE',
        scope: {
            posts: '=',
            replies: '=',
            createPost:'='
        },
        templateUrl: "directives/middleContent.html"
    };
});
sync.directive('header',function(){
  return {
        restrict: 'AE',
        scope: {
            data: '=',
            user: '=',
            type: '='
        },
        templateUrl: "./directives/header.html"

    };
});


sync.directive('keybinding', function () {
    return {
        restrict: 'E',
        scope: {
            invoke: '&'
        },
        link: function (scope, el, attr) {
            Mousetrap.bind(attr.on, scope.invoke);
        }
    };
});
