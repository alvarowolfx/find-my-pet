// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
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

  .controller('MainController', ['$scope', '$ionicModal', function ($scope, $ionicModal) {
    $scope.posts = [];
    $scope.showMap = false;

    var qtdePosts = 5;
    for (var i = qtdePosts; i >= 1; i--) {
      $scope.posts.unshift(newPost(i, i, i));
    }

    function newPost(id, title, reward) {
      return {
        id: id,
        title: title,
        user_img: "http://lorempixel.com/60/60/people/" + id,
        img: "http://lorempixel.com/300/150/animals/" + id,
        reward: reward
      };
    }

    $scope.toggleMap = function () {
      $scope.showMap = !$scope.showMap;
    }

    $scope.createPost = function () {
      $ionicModal.fromTemplateUrl('templates/modal-create-post.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.newPost = {
          reward: 5
        };

        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.savePost = function () {
      var post = angular.copy($scope.newPost);
      console.log(post);

      var x = post.reward;
      $scope.posts.unshift(newPost(x,x,x));

      $scope.closeModal();
    };

    $scope.closeModal = function () {
      $scope.modal.remove();
    };

  }]);
