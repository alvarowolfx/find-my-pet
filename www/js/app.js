// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ui.utils.masks'])

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

  .controller('MainController', ['$scope', '$ionicModal', 'Post', function ($scope, $ionicModal, Post) {
    $scope.posts = Post.all();
    $scope.showMap = false;

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

    $scope.savePost = function (form) {
      var post = angular.copy($scope.newPost);
      if (form.$valid && post.title) {
        Post.create(post);
        $scope.posts = Post.all();
        $scope.closeModal();
      }
    };

    $scope.closeModal = function () {
      $scope.modal.remove();
    };

  }])

  .factory('Post', function () {
    var service = {
      all: all,
      create: create
    };

    var posts = [];
    var qtdePosts = 5;
    for (var i = qtdePosts; i >= 1; i--) {
      posts.unshift(newTestPost(i, i));
    }

    return service;

    function all() {
      return posts;
    }

    function newTestPost(title, reward) {
      var id = posts.length;
      return {
        id: id,
        title: title,
        img: "http://lorempixel.com/300/150/animals/" + id,
        reward: reward
      };
    }

    function create(post) {
      var id = posts.length;
      post.id = id;
      post.img = "http://lorempixel.com/300/150/animals/" + id;
      posts.unshift(post);
    }
  });
