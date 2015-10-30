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

.controller('MainController', ['$scope', function($scope) {
    $scope.posts = [];

    for (var i = 10; i >= 1; i--) {
        $scope.posts.push({
            id: i,
            username: i,
            user_img: "http://lorempixel.com/60/60/people/" + i,
            img: "http://lorempixel.com/300/150/animals/" + i,
            reward: i
        });
    }

    $scope.getArray = function(num) {
        return new Array(num);
    };

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

.directive('imgLoader', ['$compile', function($compile) {
    return {
        restrict: 'A',
        link: link,
        replace: true,
        template: '<ion-spinner/>'
    };

    function link(scope, element, attrs, controllers) {
        scope.$watch('imgLoader', function(oldValue,newValue) {
            if(oldValue !== newValue){
              loadImage();
            }
        });
        loadImage();

        function loadImage() {
            img = new Image();
            img.src = attrs.imgLoader;
            img.onload = function() {
                var imgEl = document.createElement('img');
                imgEl.src = attrs.imgLoader;
                element.replaceWith(imgEl);
                element = imgEl;
            };
        }
    }
}]);
