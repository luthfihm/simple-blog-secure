'use strict';

/**
 * @ngdoc function
 * @name simpleBlogApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the simpleBlogApp
 */
angular.module('simpleBlogApp')
  .controller('RegisterCtrl', function ($scope, $http, $window) {
    $rootScope.title = "Simple Blog - Register";
    $scope.user = {};
    $scope.signup = function () {
      if ($scope.user.password == $scope.password2) {
        $http.post("/api/user/signup",$scope.user).then(function(response){
          alert("Register Success!");
          $window.location.href = "/";
        })
      } else {
        $scope.password2 = "";
      }
    };
  });
