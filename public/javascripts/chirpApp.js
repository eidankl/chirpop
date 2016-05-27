/**
 * Created by eidan on 16/05/2016.
 * Angular app that's going to control the all the functionality for the our application's front end.
 * integrate it into our main.html, login.html, index.html and signup.html views
 * */

///Module - All The Logic For Angular App
    //inject dependencies: ngRoute, ngResource and create the root scope by using .run() and declare the $rootScope and $http
var app = angular.module('chirpApp',['ngRoute', 'ngResource']).run(function($http, $rootScope){
    //declare $rootScope Variables (After we log in we can set this variables)
    $rootScope.authenticated = false;
    $rootScope.current_user = '';

    //log out function straight from the navigation
    $rootScope.signout = function(){
        //call the http end point
        $http.get('auth/signout');
        //set $rootScope authenticated and current_user to blank
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
    };
});

/*Start Config*/
app.config(function($routeProvider){
    $routeProvider
        //the time line display -- root (/) is main.html template and mainController
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })
        //the login display -- /login is login.html template and authController
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'authController'
        })
        //the signup display -- /register is register.html template and authController
        .when('/register', {
            templateUrl: 'register.html',
            controller: 'authController'
        });
});
/*End Config*/

/*Start Factory named postService  -- inject the $http service for handle http request*/

/*Services: Share Data Between Controllers - Factory: Return the value and receive the value return
* inject $$resource - Angular has a service that we can use instead of having to manually call out to our endpoint with each type of request, called ngResource*/
app.factory('postService', function($resource){
    //return the entire end point (with the id)and create all the helper function that be able to use
    return $resource('/api/posts/:id');
});
/*End Factory named postService*/

/*Start Main Controller*/
//inject the $scope and postService
app.controller('mainController', function($scope, $rootScope, postService){
    //query is just send get request to api/post and get all chirps
    $scope.posts = postService.query();
    //newPost to our $scope variable to store information on the post that's being created.
    $scope.newPost = {created_by: '', text: '', created_at: ''};

    /*Start post() - add the contents of newPost to our posts array whenever the "Chirp!" button is pressed.*/
    $scope.post = function(){
        //save function to POST our new chirp to our API
        //set the created by to current user
        $scope.newPost.created_by = $rootScope.current_user;
        //set the date and time to new post
        $scope.newPost.created_at = Date.now();
        //debugger;
        // we'll fetch the updated feed again in its callback function
        postService.save($scope.newPost, function(){
            //refresh the entire chirp stream - the posts
            $scope.posts = postService.query();
            //reset the current post to be blank again
            $scope.newPost = {created_by: '', text: '', created_at: ''};
        });
    };
    /*End post()*/
});
/*End Main Controller*/

/*Start Authentication Controller (for registration and login)*/

//inject dependencies: $scope, $rootScope, $location, $http
//In order to redirect our users on successful authentications,
//we'll need to use the $location service and direct our app to the path we'd like to go to.
//In this case, it's just our main view at /.
app.controller('authController', function($scope, $http, $rootScope, $location){
    //user scope variable
    $scope.user = {username: '', password: ''};
    //error msg variable
    $scope.error_message = '';

   /* postService.getAll().success(function(data){
        $scope.posts = data;
    });*/

    $scope.login = function(){
        //When users enter their credentials and log in, we should make request to the /auth/login endpoint we created
        $http.post('/auth/login', $scope.user).success(function(data){
            //If it's successful
            if(data.state == 'success'){
                //set $rootScope authenticated and current_user
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                //and redirect user to our posts stream
                $location.path('/');
            }
            //If it's NOT successful
            else{
                //display an error message
                $scope.error_message = data.message;
            }
        });
    };

    $scope.register = function(){
        console.log("REGISTER_______________");
        //debugger;
        //When users enter their credentials and signup, we should make request to the /auth/register endpoint we created

        $http.post('/auth/signup', $scope.user).success(function(data){
           // debugger;
            //If it's successful
            if(data.state == 'success'){
                //set $rootScope authenticated and current_user
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                //and redirect user to our posts stream
                $location.path('/');
            }
            //If it's NOT successful
            else{
                //display an error message
                $scope.error_message = data.message;
            }
        });
    };
});
/*End Authentication Controller*/