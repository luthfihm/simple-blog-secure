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
  .run(["$rootScope", "$cookies", "$window", "$http", function($rootScope, $cookies, $window, $http) {
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
  }]);

'use strict';

/**
 * @ngdoc function
 * @name simpleBlogApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the simpleBlogApp
 */
angular.module('simpleBlogApp')
  .controller('MainCtrl', ["$scope", "$http", "$rootScope", "$window", function ($scope, $http, $rootScope, $window) {
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
  }]);

'use strict';

/**
 * @ngdoc function
 * @name simpleBlogApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the simpleBlogApp
 */
angular.module('simpleBlogApp')
  .controller('AboutCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name simpleBlogApp.controller:PostCtrl
 * @description
 * # PostCtrl
 * Controller of the simpleBlogApp
 */
angular.module('simpleBlogApp')
  .controller('PostCtrl', ["$scope", "$routeParams", "$rootScope", "$http", "$window", function ($scope, $routeParams, $rootScope, $http, $window) {
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
  }]);

'use strict';

/**
 * @ngdoc function
 * @name simpleBlogApp.controller:NewpostCtrl
 * @description
 * # NewpostCtrl
 * Controller of the simpleBlogApp
 */
angular.module('simpleBlogApp')
  .controller('NewpostCtrl', ["$scope", "$rootScope", "Upload", "$window", "$http", function ($scope, $rootScope, Upload, $window, $http) {
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

    $scope.posts = [];
    $http.get('/api/post').then(function (response) {
      $scope.posts = response.data;
      for (var i=0;i<$scope.posts.length;i++){
        $scope.posts[i].content = response.data[i].content.substring(0, 400);
      }
    });
  }]);

'use strict';

/**
 * @ngdoc function
 * @name simpleBlogApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the simpleBlogApp
 */
angular.module('simpleBlogApp')
  .controller('RegisterCtrl', ["$scope", "$http", "$window", "$rootScope", function ($scope, $http, $window, $rootScope) {
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
  }]);

'use strict';

/**
 * @ngdoc function
 * @name simpleBlogApp.controller:EditpostCtrl
 * @description
 * # EditpostCtrl
 * Controller of the simpleBlogApp
 */
angular.module('simpleBlogApp')
  .controller('EditpostCtrl', ["$scope", "$rootScope", "$routeParams", "$http", "$window", "Upload", function ($scope, $rootScope, $routeParams, $http, $window, Upload) {
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
  }]);

angular.module('simpleBlogApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/about.html',
    "<p>This is the about view.</p>"
  );


  $templateCache.put('views/editpost.html',
    "<div class=\"row\"> <!-- Blog Post Content Column --> <div class=\"col-lg-8\"> <form ng-submit=\"update()\"> <!-- Title --> <div class=\"form-group\"> <input type=\"text\" class=\"form-control input-lg\" ng-model=\"post.title\" placeholder=\"Blog Post Title\"> </div> <hr> <!-- Preview Image --> <div ngf-drop ngf-select ng-model=\"post.image\" ngf-drag-over-class=\"'dragover'\" ngf-multiple=\"false\" accept=\"image/*\" ngf-pattern=\"'image/*'\"> <div class=\"drop-box\" ng-hide=\"post.image\">Drop images here or click to add image</div> <img class=\"img-responsive\" alt=\"\" src=\"{{imageSrc}}\" ng-hide=\"!post.image\"> </div> <div ngf-no-file-drop>File Drag/Drop is not supported for this browser</div> <hr> <div class=\"form-group\"> <textarea class=\"form-control\" rows=\"20\" ng-model=\"post.content\"></textarea> </div> <hr> <button type=\"submit\" class=\"btn btn-primary btn-lg\">Update</button> </form> </div> <!-- Blog Sidebar Widgets Column --> <div class=\"col-md-4\"> <!-- Blog Search Well --> <div class=\"well\"> <h4>Simple Blog</h4> <p>It's very simple blog</p> <!-- /.input-group --> </div> <!-- Blog Categories Well --> <div class=\"well\"> <h4>Latest Post</h4> <div class=\"row\" ng-repeat=\"p in posts\"> <div class=\"col-xs-3 text-center\"> <a class=\"story-img\" href=\"#/post/{{p.id}}\"><img src=\"/api/files/{{p.image}}\" style=\"width:60px;height:60px\" class=\"img-circle\"></a> </div> <div class=\"col-xs-9\"> <a href=\"#/post/{{p.id}}\"><h4>{{p.title}}</h4></a> <div class=\"row\"> <div class=\"col-xs-9\"> <ul class=\"list-inline\"> <li>{{p.created_at|timeago}}</li> <li><i class=\"glyphicon glyphicon-comment\"></i> {{p.comments.length}} Comments </li></ul></div> </div> </div> </div> <!-- /.row --> </div> <!-- Side Widget Well --> <div class=\"well\"> <h4>Quote of this day</h4> <p style=\"font-style: italic\">“Life is not complex. We are complex. Life is simple, and the simple thing is the right thing.”</p> <p>— Oscar Wilde</p> </div> </div> </div> <!-- /.row -->"
  );


  $templateCache.put('views/main.html',
    "<div id=\"masthead\"> <div class=\"container\"> <div class=\"row\"> <div class=\"col-md-7\"> <h1>Simple Blog <p class=\"lead\">It's just Simple!</p> </h1> </div> <div class=\"col-md-5\"> <div class=\"well well-lg\"> <div class=\"row\"> <div class=\"col-sm-12\"> <p style=\"font-style: italic\">“Life is not complex. We are complex. Life is simple, and the simple thing is the right thing.”</p> <p>— Oscar Wilde</p> </div> </div> </div> </div> </div> </div><!-- /cont --> </div> <div class=\"row\"> <div class=\"col-md-12\"> <div class=\"panel\"> <div class=\"panel-body\"> <!--/stories--> <div class=\"row\" ng-repeat=\"post in posts\"> <br> <div class=\"col-md-2 col-sm-3 text-center\"> <a class=\"story-img\" href=\"#/post/{{post.id}}\"><img src=\"/api/files/{{post.image}}\" style=\"width:100px;height:100px\" class=\"img-circle\"></a> </div> <div class=\"col-md-10 col-sm-9\"> <h3>{{post.title}}</h3> <div class=\"row\"> <div class=\"col-xs-9\"> <p>{{post.content}}</p> <p class=\"lead\"><a href=\"#/post/{{post.id}}\" class=\"btn btn-default\">Read More</a> <a href=\"#/editpost/{{post.id}}\" class=\"btn btn-default\" ng-show=\"post.user.id == userId\"><i class=\"glyphicon glyphicon-pencil\"></i></a> <button class=\"btn btn-default\" ng-show=\"post.user.id == userId\" ng-click=\"delete(post.id)\"><i class=\"glyphicon glyphicon-trash\"></i></button></p> <p class=\"pull-right\"><span class=\"label label-default\">{{post.user.name}}</span></p> <ul class=\"list-inline\"> <li>{{post.created_at|timeago}}</li> <li><i class=\"glyphicon glyphicon-comment\"></i> {{post.comments.length}} Comments </li></ul></div> <div class=\"col-xs-3\"></div> </div> <br><br> </div> </div> <hr> <!--/stories--> </div> </div> </div><!--/col-12--> </div>"
  );


  $templateCache.put('views/newpost.html',
    "<div class=\"row\"> <!-- Blog Post Content Column --> <div class=\"col-lg-8\"> <form ng-submit=\"save()\"> <!-- Title --> <div class=\"form-group\"> <input type=\"text\" class=\"form-control input-lg\" ng-model=\"post.title\" placeholder=\"Blog Post Title\"> </div> <hr> <!-- Preview Image --> <div ngf-drop ngf-select ng-model=\"post.image\" ngf-drag-over-class=\"'dragover'\" ngf-multiple=\"false\" accept=\"image/*\" ngf-pattern=\"'image/*'\"> <div class=\"drop-box\" ng-hide=\"post.image\">Drop images here or click to add image</div> <img class=\"img-responsive\" alt=\"\" src=\"{{imageSrc}}\" ng-hide=\"!post.image\"> </div> <div ngf-no-file-drop>File Drag/Drop is not supported for this browser</div> <hr> <div class=\"form-group\"> <textarea class=\"form-control\" rows=\"20\" ng-model=\"post.content\"></textarea> </div> <hr> <button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-disabled=\"post.title == '' && post.image == null && post.content == ''\">Save</button> <button type=\"button\" class=\"btn btn-warning btn-lg\" ng-click=\"reset()\">Reset</button> </form> </div> <!-- Blog Sidebar Widgets Column --> <div class=\"col-md-4\"> <!-- Blog Search Well --> <div class=\"well\"> <h4>Simple Blog</h4> <p>It's very simple blog</p> <!-- /.input-group --> </div> <!-- Blog Categories Well --> <div class=\"well\"> <h4>Latest Post</h4> <div class=\"row\" ng-repeat=\"p in posts\"> <div class=\"col-xs-3 text-center\"> <a class=\"story-img\" href=\"#/post/{{p.id}}\"><img src=\"/api/files/{{p.image}}\" style=\"width:60px;height:60px\" class=\"img-circle\"></a> </div> <div class=\"col-xs-9\"> <a href=\"#/post/{{p.id}}\"><h4>{{p.title}}</h4></a> <div class=\"row\"> <div class=\"col-xs-9\"> <ul class=\"list-inline\"> <li>{{p.created_at|timeago}}</li> <li><i class=\"glyphicon glyphicon-comment\"></i> {{p.comments.length}} Comments </li></ul></div> </div> </div> </div> <!-- /.row --> </div> <!-- Side Widget Well --> <div class=\"well\"> <h4>Quote of this day</h4> <p style=\"font-style: italic\">“Life is not complex. We are complex. Life is simple, and the simple thing is the right thing.”</p> <p>— Oscar Wilde</p> </div> </div> </div> <!-- /.row -->"
  );


  $templateCache.put('views/post.html',
    "<div class=\"row\"> <!-- Blog Post Content Column --> <div class=\"col-lg-8\"> <!-- Blog Post --> <!-- Title --> <h1>{{post.title}}</h1> <!-- Author --> <p class=\"lead\"> by <a href=\"#\">{{post.user.name}}</a> </p> <hr> <!-- Date/Time --> <p> <span class=\"glyphicon glyphicon-time\"></span> Posted on {{post.created_at | date:'medium'}} <button ng-click=\"delete(post.id)\" class=\"btn btn-default pull-right\" ng-show=\"post.user.id == user.id\"><span class=\"glyphicon glyphicon-trash\"></span> Hapus</button> <a href=\"#/editpost/{{post.id}}\" class=\"btn btn-default pull-right\" ng-show=\"post.user.id == user.id\"><span class=\"glyphicon glyphicon-pencil\"></span> Edit</a> </p> <hr> <!-- Preview Image --> <img class=\"img-responsive\" src=\"/api/files/{{post.image}}\" alt=\"\"> <hr> <!-- Post Content --> <p>{{post.content}}</p> <hr> <!-- Blog Comments --> <!-- Comments Form --> <div class=\"well\" ng-hide=\"!user\"> <h4>Leave a Comment:</h4> <form role=\"form\" ng-submit=\"addComment()\"> <div class=\"form-group\"> <textarea class=\"form-control\" rows=\"3\" ng-model=\"comment.text\"></textarea> </div> <button type=\"submit\" class=\"btn btn-primary\">Submit</button> </form> </div> <div class=\"well\" ng-show=\"!user\"> <h4>Please login to add comment to this post!</h4> </div> <hr> <!-- Posted Comments --> <!-- Comment --> <div class=\"media\" ng-repeat=\"comment in post.comments\"> <a class=\"pull-left\" href=\"#\"> <img class=\"media-object\" src=\"http://placehold.it/64x64\" alt=\"\"> </a> <div class=\"media-body\"> <h4 class=\"media-heading\">{{comment.user.name}} <small>{{comment.time|timeago}}</small> </h4> {{comment.text}} </div> </div> </div> <!-- Blog Sidebar Widgets Column --> <div class=\"col-md-4\"> <!-- Blog Search Well --> <div class=\"well\"> <h4>Simple Blog</h4> <p>It's very simple blog</p> <!-- /.input-group --> </div> <!-- Blog Categories Well --> <div class=\"well\"> <h4>Latest Post</h4> <div class=\"row\" ng-repeat=\"p in posts\"> <div class=\"col-xs-3 text-center\"> <a class=\"story-img\" href=\"#/post/{{p.id}}\"><img src=\"/api/files/{{p.image}}\" style=\"width:60px;height:60px\" class=\"img-circle\"></a> </div> <div class=\"col-xs-9\"> <a href=\"#/post/{{p.id}}\"><h4>{{p.title}}</h4></a> <div class=\"row\"> <div class=\"col-xs-9\"> <ul class=\"list-inline\"> <li>{{p.created_at|timeago}}</li> <li><i class=\"glyphicon glyphicon-comment\"></i> {{p.comments.length}} Comments </li></ul></div> </div> </div> </div> <!-- /.row --> </div> <!-- Side Widget Well --> <div class=\"well\"> <h4>Quote of this day</h4> <p style=\"font-style: italic\">“Life is not complex. We are complex. Life is simple, and the simple thing is the right thing.”</p> <p>— Oscar Wilde</p> </div> </div> </div> <!-- /.row -->"
  );


  $templateCache.put('views/register.html',
    "<div class=\"row\"> <div class=\"col-md-8 col-md-offset-2\"> <br> <center><h3>Register to Simple Blog</h3></center> <br> <div class=\"row\"> <form class=\"form-horizontal\" ng-submit=\"signup()\" role=\"form\"> <div class=\"form-group\"> <label for=\"username\" class=\"col-sm-3 control-label\">Username</label> <div class=\"col-sm-9\"> <input type=\"text\" class=\"form-control\" id=\"username\" placeholder=\"Username\" required ng-model=\"user.username\"> </div> </div> <div class=\"form-group\"> <label for=\"password\" class=\"col-sm-3 control-label\">Password</label> <div class=\"col-sm-9\"> <input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Password\" required ng-model=\"user.password\"> </div> </div> <div class=\"form-group\"> <label for=\"password2\" class=\"col-sm-3 control-label\">Re-type Password</label> <div class=\"col-sm-9\"> <input type=\"password\" class=\"form-control\" id=\"password2\" placeholder=\"Re-type Password\" required ng-model=\"password2\"> </div> </div> <div class=\"form-group\"> <label for=\"name\" class=\"col-sm-3 control-label\">Name</label> <div class=\"col-sm-9\"> <input type=\"text\" class=\"form-control\" id=\"name\" placeholder=\"Name\" required ng-model=\"user.name\"> </div> </div> <div class=\"form-group\"> <div class=\"col-sm-offset-3 col-sm-9\"> <button type=\"submit\" class=\"btn btn-default\">Register</button> </div> </div> </form> </div> </div> </div>"
  );

}]);
