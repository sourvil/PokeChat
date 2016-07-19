var app = angular.module('appPokeChat', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'ctrlPoke'
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'ctrlPoke'
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


app.controller('ctrlPoke', function ($scope) {
    $scope.isLoggedIn = false;
    $scope.username = '';

    $scope.pokes = [];
    $scope.newPoke = {
        createdBy: 'burak',
        createdAt: Date.now(),
        message: 'ahandaaa'
    };

    $scope.pokes.push($scope.newPoke);    

});

app.controller('ctrlAuth', function ($scope) {
    $scope.signup = function () {
        $scope.errorMessage = 'Üyelik talebi';
        // TODO NodeJS API Post
        
    };

    $scope.login = function () {
        $scope.errorMessage = 'Giriş talebi';
    };
});

