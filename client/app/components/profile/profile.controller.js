'use strict';

angular.module('myApp.profile', ['ngRoute','myApp.profileFactory'])

// Declared route
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/monprofil', {
            templateUrl: '/components/profile/profile.html',
            controller: 'ProfileCtrl',
            access: {
                requiredLogin: true
            }
        });
    }])
    .controller('ProfileCtrl', ['$scope','$location','ProfileFactory',function($scope,$location,ProfileFactory){
        $scope.infos = {
            id:"",
            mdp: "",
            confMdp: "",
            mail: "",
            nom: "",
            prenom: ""
        };
        ProfileFactory.getProfile().success(function(res){
           $scope.infos = res.data.utilisateur;
        });

        $scope.updateInfo = function()
        {
            if($scope.infos.mdp && $scope.infos.confMdp){
                if($scope.infos.mdp !== $scope.infos.confMdp){
                    alert("Les mots de passe ne correspondent pas !");
                }else{
                    var id_utilisateur = $scope.infos.id;
                    delete $scope.infos.confMdp;
                    delete $scope.infos.id;
                    ProfileFactory.updateProfile(id_utilisateur,$scope.infos).success(function(){
                        alert('Les informations ont été modifiées');
                        $location.path('/home-connect');
                    }).error(function(){
                        alert('Erreur lors de la modification des informations');
                    });
                }
            }else{
                alert('Formulaire invalide');
            }
        };
    }]);