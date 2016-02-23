'use strict';

/**
 * @ngdoc function
 * @name simpleBlogApp.controller:EditpostCtrl
 * @description
 * # EditpostCtrl
 * Controller of the simpleBlogApp
 */
angular.module('simpleBlogApp')
  .controller('EditpostCtrl', function ($scope, $rootScope, $routeParams, $http, $window, Upload) {
    $rootScope.title = "Simple Blog - Edit Post";
    if ($rootScope.user != null) {
      $scope.post = {};
      $scope.imageSrc = null;
      $scope.$watch('post.image', function () {
        console.log(typeof $scope.post.image);
        if (typeof $scope.post.image === "object") {
          var reader = new FileReader();
          reader.onload = function(e) {
            $scope.$apply(function () {
              $scope.imageSrc = e.target.result;
            });
          };

          reader.readAsDataURL($scope.post.image);

        }
      });
      $http.get("/api/post/"+$routeParams.id).then(function (response) {
        if (response.data.user.id == $rootScope.user.id) {
          $scope.post = response.data;
          $scope.imageSrc = "/api/files/"+ $scope.post.image;
        } else {
          $window.location.href = "/";
        }

      }, function (error) {
        console.log(error);
        $window.location = "/";
      });
      $scope.update = function () {
        Upload.upload({
          url: '/api/post/'+$scope.post.id,
          data: {
            title: $scope.post.title,
            image: $scope.post.image,
            content: $scope.post.content,
            user_id: $scope.post.user.id
          }
        }).then(function (resp) {
          $window.location.href = "/";
        }, null, function (evt) {

        });
      }
    } else {
      $window.location.href = "/";
    }

    $scope.posts = [];
    $http.get('/api/post').then(function (response) {
      $scope.posts = response.data;
      for (var i=0;i<$scope.posts.length;i++){
        $scope.posts[i].content = response.data[i].content.substring(0, 400);
      }
    });
  });
