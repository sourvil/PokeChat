var app = angular.module('appPokeChat', ['ngRoute', 'ngResource'])
    .run(function ($rootScope) {
        $rootScope.authenticated = false;
        $rootScope.currentUser = '---Misafir---';
        $rootScope.currentUserId = '';

        $rootScope.signout = function () {
            $http.get('auth/signout');
            $rootScope.authenticated = false;
            $rootScope.currentUser = '---Misafir---';
            $rootScope.currentUserId = '';
        };

    });

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'ctrlPoke'
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'ctrlAuth'
        })
        .when('/signup', {
            templateUrl: 'signup.html',
            controller: 'ctrlAuth'
        })
        .when('/tip', {
            templateUrl: 'tip.html',
            controller: 'ctrlPoke'
        })
        .when('/chat', {
            templateUrl: 'chat.html',
            controller: 'ctrlPoke'
        })
        .when('/pokemon', {
            templateUrl: 'pokemon.html',
            controller: 'ctrlPoke'
        })
        ;

});


app.controller('ctrlPoke', function ($scope, chatService, $rootScope) {
    //$scope.authenticated = false;
    //$scope.username = '';

    $scope.pokes = chatService.query();
    console.log('pokes are received - 1');
    //$scope.newPoke = { createdBy: '', createdAt: '', message: '' };

    //chatService.getAll().success(function (data) {
    //    $scope.pokes = data;
    //});
    $scope.poke = function () {
        $scope.newPoke.createdAt = Date.now();
        $scope.newPoke.createdBy = $rootScope.currentUserId;
        //console.log('Poke Message: ' + $scope.newPoke.message);

        chatService.save($scope.newPoke, function () {
            console.log('poke is saved');
            $scope.pokes = chatService.query();
            console.log('pokes are received - 2');
            $scope.newPoke = { createdBy: '', createdAt: '', message: '' };
        });
        
    };
});

app.controller('ctrlAuth', function ($scope, $http, $rootScope, $location) {
    $scope.user = { username: '', password: '' };
    $scope.errorMessage = '';

    $scope.signup = function () {

        $http.post('/auth/signup', $scope.user).success(function (data) {
            console.log(data);
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.currentUser = data.user.username;
                $rootScope.currentUserId = data.user.id;
                $location.path('/');
            }
            else {
                $scope.errorMessage = data.message;
            }
        });        
    };

    $scope.login = function () {
        $http.post('/auth/login', $scope.user).success(function (data) {
            if (data.state == 'success') {
                console.log(data.user.username + 'user is logged in. ID: ' + data.user._id);
                $rootScope.authenticated = true;
                $rootScope.currentUser = data.user.username;
                $rootScope.currentUserId = data.user._id;
                $location.path('/');
            }
            else {
                console.log(data.user.username + 'cannot login');
                $scope.errorMessage = data.message;
            }
        });
    };
});

app.factory('chatService', function ($resource) {
    return $resource('/chat/:id');
});
