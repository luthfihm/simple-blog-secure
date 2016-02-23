'use strict';

/**
 * @ngdoc function
 * @name simpleBlogApp.controller:NewpostCtrl
 * @description
 * # NewpostCtrl
 * Controller of the simpleBlogApp
 */
angular.module('simpleBlogApp')
  .controller('NewpostCtrl', function ($scope, $rootScope, Upload, $window) {
    $rootScope.title = "Simple Blog - New Post";
    if ($rootScope.user != null) {
      $scope.post = {};
      $scope.imageSrc = null;
      $scope.$watch('post.image', function () {
        if ($scope.post.image != null) {
          var reader = new FileReader();
          reader.onload = function(e) {
            $scope.$apply(function () {
              $scope.imageSrc = e.target.result;
            });
          };

          reader.readAsDataURL($scope.post.image);

        }
      });

      $scope.reset = function() {
        $scope.post = {};
      };

      $scope.save = function() {
        $scope.post.user = $rootScope.user;
        Upload.upload({
          url: '/api/post',
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
  });
