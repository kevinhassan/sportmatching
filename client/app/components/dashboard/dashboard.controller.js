'use strict';

angular.module('myApp.dashboard', ['ngRoute','myApp.dashboardFactory','myApp.dashboardService'])

// Declared route
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
        .when('/dashboard', {
            templateUrl: '/components/dashboard/dashboard.html',
            controller: 'DashboardCtrl',
            access: {
                requiredLogin: true
            }
        })
        .when('/dashboard/villes', {
            templateUrl: '/components/dashboard/villes.html',
            controller: 'DashboardVilleCtrl',
            access: {
                requiredLogin: true
            }
        })
        .when('/dashboard/ville/terrains', {
            templateUrl: '/components/dashboard/terrains.html',
            controller: 'DashboardTerrainCtrl',
            access: {
                requiredLogin: true
            }
        })
        .when('/dashboard/utilisateurs', {
            templateUrl: '/components/dashboard/utilisateurs.html',
            controller: 'DashboardUtilisateurCtrl',
            access: {
                requiredLogin: true
            }
        })
    }])

    .controller('DashboardCtrl', ['$scope',function($scope){
        $scope.load = function(){
            $('.special.cards .image').dimmer({
                on: 'hover'
            });
        };
        $scope.load();
    }])
    .controller('DashboardVilleCtrl', ['$scope','$location','DashboardVilleFactory','DashboardVilleService',function($scope,$location,DashboardVilleFactory,DashboardVilleService){
        $scope.villes = [];
        DashboardVilleFactory.getVilles().success(function(res){
            $scope.villes = res.data.villes;
        });
        $scope.selectAll = function(){
            $('#selectAll').addClass('disabled');
            $('#deselectAll').removeClass('disabled');
            $('.slider.checkbox input[type="checkbox"]').prop('checked', true);
            $scope.villes.map(function(ville){
                ville.selected = true;
            })
        };
        $scope.deselectAll = function(){
            $('#selectAll').removeClass('disabled');
            $('#deselectAll').addClass('disabled');
            $('.slider.checkbox input[type="checkbox"]').prop('checked', false);
            $scope.isShow = false;
            $scope.villes.map(function(ville){
                ville.selected = false;
            })
        };
        $scope.supprimerVilles = function(){
            $scope.villes.map(function(ville){
                if(ville.selected){
                    DashboardVilleFactory.deleteVille(ville.id).success(function(res){
                        var index = $scope.villes.indexOf(ville);
                        $scope.villes.splice(index, 1);
                    });
                }
            })
        };
        $scope.selectVille = function(id_ville){
            DashboardVilleService.addVille(id_ville);
            $location.path('/dashboard/ville/terrains');
        }
    }])
    .controller('DashboardUtilisateurCtrl', ['$scope','DashboardUtilisateurFactory',function($scope,DashboardUtilisateurFactory){
        $scope.utilisateurs = [];
        DashboardUtilisateurFactory.getUtilisateurs().success(function(res){
            $scope.utilisateurs = res.data.utilisateurs;
        });
        $scope.changePermissions = function(id,newPermision){
            DashboardUtilisateurFactory.updatePermission(id,newPermision).success(function(res){
                alert(res.message);
            });
        };
        $scope.selectAll = function(){
            $('#selectAll').addClass('disabled');
            $('#deselectAll').removeClass('disabled');
            $('.slider.checkbox input[type="checkbox"]').prop('checked', true);
            $scope.utilisateurs.map(function(utilisateur){
                utilisateur.selected = true;
            })
        };
        $scope.deselectAll = function(){
            $('#selectAll').removeClass('disabled');
            $('#deselectAll').addClass('disabled');
            $('.slider.checkbox input[type="checkbox"]').prop('checked', false);
            $scope.utilisateurs.map(function(utilisateur){
                utilisateur.selected = false;
            })
        };
        $scope.supprimerUtilisateurs = function(){
            $scope.utilisateurs.map(function(utilisateur){
                if(utilisateur.selected){
                    DashboardUtilisateurFactory.deleteUtilisateur(utilisateur.id).success(function(res){
                        var index = $scope.utilisateurs.indexOf(utilisateur);
                        $scope.utilisateurs.splice(index, 1);
                    });
                }
            })
        }
    }])
    .controller('DashboardTerrainCtrl', ['$scope','DashboardTerrainFactory','DashboardVilleService',function($scope,DashboardTerrainFactory,DashboardVilleService){
        $scope.terrains = [];
        DashboardTerrainFactory.getTerrains(DashboardVilleService.getVilleId()).success(function(res){
            $scope.terrains = res.data.terrains;
        });
        $scope.selectAll = function(){
            $('#selectAll').addClass('disabled');
            $('#deselectAll').removeClass('disabled');
            $('.slider.checkbox input[type="checkbox"]').prop('checked', true);
            $scope.terrains.map(function(terrain){
                terrain.selected = true;
            })
        };
        $scope.deselectAll = function(){
            $('#selectAll').removeClass('disabled');
            $('#deselectAll').addClass('disabled');
            $('.slider.checkbox input[type="checkbox"]').prop('checked', false);
            $scope.terrains.map(function(terrain){
                terrain.selected = false;
            })
        };
        $scope.supprimerTerrains = function(){
            $scope.terrains.map(function(terrain){
                if(terrain.selected){
                    DashboardTerrainFactory.deleteTerrain(terrain.id).success(function(res){
                        var index = $scope.terrains.indexOf(terrain);
                        $scope.terrains.splice(index, 1);
                    });
                }
            })
        }
    }]);