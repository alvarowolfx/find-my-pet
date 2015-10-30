// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.controller('MainController', ['$scope', '$ionicModal', function($scope, $ionicModal) {
    $scope.posts = [];
    $scope.showMap = false;

    for (var i = 1; i >= 1; i--) {
        $scope.posts.push(newPost(i, i, i));
    }

    function newPost(id, username, reward) {
        return {
            id: id,
            username: username,
            user_img: "http://lorempixel.com/60/60/people/" + id,
            img: "http://lorempixel.com/300/150/animals/" + id,
            reward: reward
        };
    }

    $scope.toggleMap = function(){
      $scope.showMap = !$scope.showMap;
    }

    $scope.createPost = function() {
        $ionicModal.fromTemplateUrl('templates/modal-create-post.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.newPost = {
                reward: 5
            };

            $scope.modal = modal;
            $scope.modal.show();
            var x = Math.floor((Math.random() * 10) + 1);
            $scope.posts.push(newPost(x, x, x));
        });
    }

    $scope.closeModal = function() {
        $scope.modal.remove();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        if ($scope.modal) {
            $scope.modal.remove();
        }
    });

}])

.directive('ngTimes', function($compile) {
    return {
        restrict: 'A',
        link: link,
        transclude: true,
        scope: {
            ngTimes: '=ngTimes'
        }
    };

    function link(scope, element, attrs, controllers, transclude) {
        var originalContent;

        transclude(scope, function(content) {
            originalContent = content.html();
        });

        scope.$watch('ngTimes', generate);

        function generate() {
            var content = "<span ng-repeat='r in getArray() track by $index'>";
            content += originalContent;
            content += "</span>";
            var newContent = $compile(content)(scope);
            element.replaceWith(newContent);
            element = newContent;
        }

        scope.getArray = function() {
            return new Array(scope.ngTimes);
        };
    }
})

.directive('imgLoader', ['$compile', '$ionicScrollDelegate', function($compile, $ionicScrollDelegate) {
    return {
        restrict: 'A',
        link: link,
        replace: true,
        template: '<ion-spinner/>'
    };

    function link(scope, element, attrs, controllers) {
        scope.$watch('imgLoader', function(oldValue, newValue) {
            if (oldValue !== newValue) {
                loadImage();
            }
        });
        loadImage();

        function loadImage() {
            img = new Image();
            img.src = attrs.imgLoader;
            img.onload = function() {
                element.replaceWith(img);
                element = img;
                $ionicScrollDelegate.resize();
            };
        }
    }
}]);
