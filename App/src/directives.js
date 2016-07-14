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
                    e.preventDefault();
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
