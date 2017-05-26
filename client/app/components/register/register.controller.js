'use strict';

angular.module('myApp.register', ['ngRoute','myApp.registerFactory','myApp.registerService'])

// Declared route
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/register', {
            templateUrl: 'components/register/register.html',
            controller: 'RegisterCtrl',
            access: {
                requiredLogin: false
            }
        });
    }])

    .controller('RegisterCtrl', ['$scope','$location', 'RegisterFactory','RegisterService', function ($scope,$location,RegisterFactory,RegisterService) {
        $scope.utilisateur = {
            mail: "",
            mdp: "",
            prenom: "",
            nom: "",
            mdpConfirm:""
        };
        $scope.register = function () {
            var mail = $scope.utilisateur.mail,
                mdp = $scope.utilisateur.mdp,
                prenom = $scope.utilisateur.prenom,
                nom = $scope.utilisateur.nom,
                mdpConfirm = $scope.utilisateur.mdpConfirm;

            if (mail !== "" && mdp !== "" && prenom !== "" && nom !== "" && mdpConfirm !== "") {
                if(mdp !== mdpConfirm){
                    alert('Les mots de passe ne correspondent pas');
                }else{
                    delete $scope.utilisateur.mdpConfirm;
                    RegisterFactory.addUtilisateur($scope.utilisateur).success(function(res){
                        alert('Votre compte vient d\'être crée');
                        RegisterService.addUtilisateur(res.data);
                        $location.path('/login');
                    }).error(function(err){
                        alert(err.message);
                    });
                }
            }else{
                alert('Veuillez remplir tous les champs du formulaire');
            }
        }
    }]);