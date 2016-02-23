'use strict';

/**
 * @ngdoc function
 * @name simpleBlogApp.controller:PostCtrl
 * @description
 * # PostCtrl
 * Controller of the simpleBlogApp
 */
angular.module('simpleBlogApp')
  .controller('PostCtrl', function ($scope, $routeParams, $rootScope, $http, $window) {
    $scope.user = $rootScope.user;
    $scope.post = {};
    $http.get("/api/post/"+$routeParams.id).then(function (response) {
      $scope.post = response.data;
      $rootScope.title = "Simple Blog - "+$scope.post.title;
    }, function (error) {
      console.log(error);
      $window.location = "/";
    });
    $scope.comment = {};
    $scope.addComment = function () {
      $scope.comment.postId = $scope.post.id;
      $scope.comment.userId = $rootScope.user.id;
      $http.post("/api/post/"+$routeParams.id+"/comments",$scope.comment).then(function(response){
        $scope.comment = {};
        $http.get("/api/post/"+$routeParams.id+"/comments").then(function (response) {
          $scope.post.comments = response.data;
        });
      });
    };
    $scope.delete = function (id) {
      if (confirm('Are you sure to delete this post?')) {
        $http.delete('/api/post/'+id).then(function () {
          $window.location = '/';
        });
      }
    };

    $scope.posts = [];
    $http.get('/api/post').then(function (response) {
      $scope.posts = response.data;
      for (var i=0;i<$scope.posts.length;i++){
        $scope.posts[i].content = response.data[i].content.substring(0, 400);
      }
    });
  });
