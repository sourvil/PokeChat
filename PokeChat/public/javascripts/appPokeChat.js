angular.module('appPokeChat', null)
    .controller('ctrlPoke', function ($scope) {
        $scope.Pokes = {
            createdBy: 'burak',
            createdAt: Date.now(),
            pokeMessage: 'ahandaaa'
        };

    });

