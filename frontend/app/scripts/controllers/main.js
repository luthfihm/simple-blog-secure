'use strict';

/**
 * @ngdoc function
 * @name simpleBlogApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the simpleBlogApp
 */
angular.module('simpleBlogApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $window) {
    $rootScope.title = "Simple Blog - Home";
    if ($rootScope.user != null)
      $scope.userId = $rootScope.user.id;
    $scope.posts = [];
    $http.get('/api/post').then(function (response) {
      $scope.posts = response.data;
      for (var i=0;i<$scope.posts.length;i++){
        $scope.posts[i].content = response.data[i].content.substring(0, 400);
      }
    });

    $scope.delete = function (id) {
      if (confirm('Are you sure to delete this post?')) {
        $http.delete('/api/post/'+id).then(function () {
          $window.location = '/';
        });
      }
    };
  });
