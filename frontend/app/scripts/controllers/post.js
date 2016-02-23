'use strict';

/**
 * @ngdoc function
 * @name simpleBlogApp.controller:PostCtrl
 * @description
 * # PostCtrl
 * Controller of the simpleBlogApp
 */
angular.module('simpleBlogApp')
  .controller('PostCtrl', function ($scope, $routeParams, $rootScope, $http, $cookies) {
    $scope.user = $rootScope.user;
    $scope.post = {};
    $http.get("/api/post/"+$routeParams.id).then(function (response) {
      $scope.post = response.data;
      $rootScope.title = "Simple Blog - "+$scope.post.title;
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
  });
