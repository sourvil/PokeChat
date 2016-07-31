var app = angular.module('appPokeChat', ['ngRoute', 'ngResource'])
    .run(function ($rootScope) {
        //var socketItem;

        $rootScope.authenticated = false;
        $rootScope.currentUser = '---Misafir---';
        $rootScope.currentUserId = '';

        $rootScope.activeUsers = [];

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
            controller: 'ctrlAuth'
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'ctrlAuth'
        })
        .when('/signup', {
            templateUrl: 'signup.html',
            controller: 'ctrlAuth'
        })
        .when('/chat', {
            templateUrl: 'chat.html',
            controller: 'ctrlPoke'
        })
        ;
});

app.controller('ctrlAuth', function ($scope, $http, $rootScope, $location, socket) {
    
    console.log('ctrlAuth');
    
    $scope.user = { username: '', password: '' };
    $scope.errorMessage = '';

    socket.on("login", function (data) {
        console.log("client:login: " + JSON.stringify(data));
    });

    socket.emit('usernamesFromServer', '');

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
                console.log(data.user.username + ' is logged in. ID: ' + data.user._id);

                $rootScope.authenticated = true;
                $rootScope.currentUser = data.user.username;
                $rootScope.currentUserId = data.user._id;
                
                //socket.emit('login', $rootScope.currentUser);

                $location.path('/');
            }
            else {
                console.log($scope.user.username + ' cannot login');
                $scope.errorMessage = data.message;
            }
        });
    };
});

app.controller('ctrlPoke', function ($scope, chatService, $rootScope, socket) {

    console.log('ctrlPoke');
    
    $rootScope.pokes = chatService.query();

    $scope.poke = function () {
        $scope.newPoke.createdAt = Date.now();
        $scope.newPoke.createdBy = $rootScope.currentUserId;

        chatService.save($scope.newPoke, function () {
            console.log('poke is saved');
            $rootScope.pokes = chatService.query();

            socket.emit('messageToServer', $scope.newPoke);

            $scope.newPoke = { createdBy: '', createdAt: '', message: '' };            
        });        
    };

    socket.on('messageToClient', function (data) {
        console.log('client:message: ' + data.message + ' from: ' + data.createdBy + ' at: ' + data.createdAt);
        $rootScope.pokes = chatService.query();
        console.log('$rootScope.pokes is loaded: ' + $rootScope.pokes);
    });

    socket.on('usernamesToClient', function (data) {
        console.log("client:usernames: " + JSON.stringify(data));
        $rootScope.activeUsers = data;
    });
    socket.emit('usernamesFromServer', '');
});


app.factory('chatService', function ($resource) {
    return $resource('/chat');
});

app.factory('socket', ['$rootScope' , '$http', function ($rootScope,$http) {
    
    
    $http.get('auth/socketurl').then(function successCallback(response){
        $rootScope.socketUrl = response.data;
        console.log("response.data:"+response.data);
    });
    
    console.log("socketUrl:" + $rootScope.socketUrl);
    var socket = io.connect($rootScope.socketUrl, { reconnect: true });


    return {
        on: function (eventName, callback) {
            console.log('socket.on:' + $rootScope.socketUrl);
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }

            socket.on(eventName, wrapper);

            return function () {
                socket.removeListener(eventName, wrapper);
            };
        },

        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
}]);
