'use strict';

/**
 * @ngdoc overview
 * @name simpleBlogApp
 * @description
 * # simpleBlogApp
 *
 * Main module of the application.
 */
angular
  .module('simpleBlogApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngtimeago',
    'ngFileUpload'
  ])
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/post/:id', {
        templateUrl: 'views/post.html',
        controller: 'PostCtrl',
        controllerAs: 'post'
      })
      .when('/newpost', {
        templateUrl: 'views/newpost.html',
        controller: 'NewpostCtrl',
        controllerAs: 'newPost'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/editpost/:id', {
        templateUrl: 'views/editpost.html',
        controller: 'EditpostCtrl',
        controllerAs: 'editpost'
      })
      .otherwise({
        redirectTo: '/'
      });

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }])
  .run(function($rootScope, $cookies, $window, $http) {
    $rootScope.user = null;

    $http.get("/api/user/current").then(function (response) {
      $rootScope.loggedIn = true;
      $rootScope.user = response.data;
      console.log($rootScope.user);
    });

    $rootScope.login = function() {
      var user = {
        username: $rootScope.username,
        password: $rootScope.password,
        remember: $rootScope.remember
      };

      console.log(user);

      $http.post("/api/user/login",user).then(function (response) {
        $window.location.reload();
      });
    };

    $rootScope.logout = function () {
      $http.get("/api/user/logout").then(function (response) {
        console.log(response.data);
        $window.location.reload();
      });
    }
  });
