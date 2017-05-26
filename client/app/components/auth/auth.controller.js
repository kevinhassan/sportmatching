angular.module('myApp.auth', ['ngRoute','myApp.authFactory','myApp.registerService'])
// Declared route
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: '/components/auth/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory','RegisterService',
    function($scope, $window, $location, UserAuthFactory, AuthenticationFactory,RegisterService) {
        $scope.utilisateur = {
            mail: RegisterService.getUtilisateurMail(),
            mdp: ""
        };
        $scope.login = function() {
                var mail = $scope.utilisateur.mail,
                mdp = $scope.utilisateur.mdp;
            if ( mail !== "" && mdp !== "") {

                UserAuthFactory.login(mail, mdp).success(function(msg) {
                    AuthenticationFactory.isLogged = true;
                    $window.sessionStorage.token = msg.data.token;
                    AuthenticationFactory.isAdmin= msg.data.utilisateur.est_admin;
                    $location.path("/home-connect");

                }).error(function(status) {
                    alert('Erreur de mot de passe et/ou d\'identifiant');
                });
            } else {
                alert('Veuillez remplir tous les champs du formulaire');
            }
        };
    }
]);