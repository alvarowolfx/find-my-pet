// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ui.utils.masks', 'ngCordova', 'firebase']);

app.run(['$ionicPlatform', InitApp]);
app.controller('MainController', ['$scope', '$ionicModal', 'Post', '$ionicLoading','$cordovaCamera', MainController]);
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

function MainController($scope, $ionicModal, Post, $ionicLoading, $cordovaCamera) {
  $scope.posts = Post.all();
  $ionicLoading.show();
  $scope.posts.$loaded().finally(function(){
    $ionicLoading.hide();
  });


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
    if (form.$valid && post.title && post.photo) {
      post.img = 'data:image/jpeg;base64,'+post.photo;
      delete post.photo;
      Post.create(post);
      $scope.posts = Post.all();
      $scope.closeModal();
    }
  };

  $scope.likePost = function(post){
    Post.like(post);
  };

  $scope.alreadyLiked = function(post){
    return Post.alreadyLiked(post);
  };

  $scope.closeModal = function () {
    $scope.modal.remove();
  };

  function getCommonCameraOption() {
    return {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      saveToPhotoAlbum: false
    }
  }

  $scope.takePicture = function() {
    var options = getCommonCameraOption();
    options.sourceType = Camera.PictureSourceType.CAMERA;
    getPictureWithOptions(options);
  };

  $scope.selectPicture = function() {
    var options = getCommonCameraOption();
    options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
    getPictureWithOptions(options);
  };

  function getPictureWithOptions(options) {
    $ionicLoading.show();
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.newPost.photo = imageData;
    }, function(err) {
      // error
    }).finally(function(){
      $ionicLoading.hide();
    });
  }

};

function Post(User, FirebaseURL, $firebaseArray) {
  var service = {
    all: all,
    create: create,
    like: like,
    alreadyLiked: alreadyLiked
  };

  var postsRef = new Firebase(FirebaseURL + '/posts');

  return service;

  function all() {
    return $firebaseArray(postsRef);
  }

  function create(post) {
    post.user_id = User.getUserIdentifier();
    post.created_at = (new Date()).toISOString();

    var item = postsRef.push();
    item.setWithPriority(post, 0 - Date.now());
  }

  function like(postId){
    var posts = all();
    return posts.$loaded().then(function(){
      var post = posts.$getRecord(postId);
      if(alreadyLiked(post)){
        return
      }
      post.likes = post.likes || [];
      var user_id = User.getUserIdentifier();
      post.likes.push(user_id);
      posts.$save(post);
    });

  }

  function alreadyLiked(post){
    var user_id = User.getUserIdentifier();
    if(!post.likes){
      return false
    }else{
      return post.likes.indexOf(user_id) != -1;
    }
  }
}

function User($cordovaDevice) {
  var service = {
    getUserIdentifier: getUserIdentifier
  };

  var token = window.localStorage.getItem('token');
  if(!token) {
    try {
      token = $cordovaDevice.getUUID();
      window.localStorage.setItem('token',token);
    } catch (e) {
      token = "FAKE_USER_ID_" + Math.random();
      window.localStorage.setItem('token',token);
    }
  }

  return service;

  function getUserIdentifier() {
    return token;
  }
}
