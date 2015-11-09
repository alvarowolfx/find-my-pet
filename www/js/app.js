// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ui.utils.masks', 'ngCordova', 'firebase']);

app.run(['$ionicPlatform', InitApp]);
app.controller('MainController', ['$scope', '$ionicModal', 'Post', '$ionicLoading', MainController]);
app.constant("FirebaseURL", "https://scorching-fire-4975.firebaseio.com");
app.factory('Post', ['User', 'FirebaseURL', '$firebaseArray', Post]);
app.factory('User', ['$cordovaDevice', User]);

function InitApp($ionicPlatform) {
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
}

function MainController($scope, $ionicModal, Post, $ionicLoading) {
  $scope.posts = Post.all();
  $ionicLoading.show();
  $scope.posts.$loaded().finally(function(){
    $ionicLoading.hide();
  });
  //postsRef.$bindTo($scope,"posts");

  $scope.showMap = false;

  $scope.toggleMap = function () {
    $scope.showMap = !$scope.showMap;
  };

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

};

function Post(User, FirebaseURL, $firebaseArray) {
  var service = {
    all: all,
    create: create
  };

  var postsRef = new Firebase(FirebaseURL + '/posts');

  return service;

  function all() {
    return $firebaseArray(postsRef);
  }

  function create(post) {
    var posts = all();
    var id = posts.length + 1;
    post.id = id;
    post.img = "http://lorempixel.com/300/150/animals/" + id;
    post.user_id = User.getUserIdentifier();
    post.created_at = (new Date()).toISOString();

    var item = postsRef.push();
    item.setWithPriority(post, 0 - Date.now());
    //posts.$add(post);
  }
}

function User($cordovaDevice) {
  var service = {
    getUserIdentifier: getUserIdentifier
  };

  var userId;
  try {
    userId = $cordovaDevice.getUUID();
  } catch (e) {
    userId = "FAKE_USER_ID_" + Math.random();
  }

  return service;

  function getUserIdentifier() {
    return userId;
  }
}
