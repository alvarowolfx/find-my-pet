/**
 * Created by alvaroviebrantz on 07/11/15.
 */
angular.module('starter').directive('ngTimes', function ($compile) {
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

      transclude(scope, function (content) {
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

      scope.getArray = function () {
        return new Array(scope.ngTimes);
      };
    }
  })

  .directive('imgLoader', ['$compile', '$ionicScrollDelegate', function ($compile, $ionicScrollDelegate) {
    return {
      restrict: 'A',
      link: link,
      replace: true,
      template: '<ion-spinner/>'
    };

    function link(scope, element, attrs) {
      var currentElement = element;
      scope.$watch('imgLoader', function (oldValue, newValue) {
        if (oldValue !== newValue) {
          loadImage();
        }
      });
      loadImage();

      function loadImage() {
        var img = new Image();
        img.src = attrs.imgLoader;
        img.onload = function () {
          var replacement = angular.element(img);
          currentElement.replaceWith(replacement);
          currentElement = replacement;
          $ionicScrollDelegate.resize();
        };
      }
    }
  }]);
