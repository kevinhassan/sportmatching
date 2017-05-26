'use strict';

angular.module('myApp.attente', ['ngRoute','myApp.attenteFactory'])

// Declared route
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/attente', {
                templateUrl: '/components/attente/attente.html',
                controller: 'AttenteCtrl',
                access: {
                    requiredLogin: true
                }
            })
    }])

    .controller('AttenteCtrl', ['$scope','SportFactory','AttenteFactory',function($scope,SportFactory,AttenteFactory) {
        $scope.attente={
            nbr_personne: "",
            distance_max: "",
            sport_id: "",
            localisation:{
                latitude:"",
                longitude: ""
            }
        };
        $scope.attentes =[];
        $scope.sports=[];

        $scope.selectAll = function(){
            $('#selectAll').addClass('disabled');
            $('#deselectAll').removeClass('disabled');
            $('.slider.checkbox input[type="checkbox"]').prop('checked', true);
            $scope.attentes.map(function(attente){
                attente.selected = true;
            })
        };
        $scope.deselectAll = function(){
            $('#selectAll').removeClass('disabled');
            $('#deselectAll').addClass('disabled');
            $('.slider.checkbox input[type="checkbox"]').prop('checked', false);
            $scope.attentes.map(function(attente){
                attente.selected = false;
            })
        };
        $scope.supprimerAttentes = function(){
            $scope.attentes.map(function(attente){
                if(attente.selected){
                    AttenteFactory.deleteAttente(attente.sport.id).success(function(res){
                        var index = $scope.attentes.indexOf(attente);
                        $scope.attentes.splice(index, 1);
                    });
                }
            })
        };
        SportFactory.getSports().success(function (res) {
            $scope.$watch('sports',function(){
                $scope.sports = res.data.sports;
            })
        });
        $scope.addAttente = function(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    if (($scope.attente.nbr_personne && $scope.attente.nbr_personne>=1)&& ($scope.attente.distance_max && $scope.attente.distance_max>0)&& $scope.attente.sport){
                        $scope.attente.localisation.latitude = position.coords.latitude;
                        $scope.attente.localisation.longitude = position.coords.longitude;
                        $scope.attente.sport_id = $scope.attente.sport.id;
                        AttenteFactory.addAttente($scope.attente).success(function(res){
                            $scope.attente.date =Date.now();
                            $scope.attentes.push($scope.attente);
                            alert(res.message);
                        }).error(function(err){
                           alert(err.message);
                        });
                    }else{
                        alert('Le formulaire n\'est pas valide');
                    }
                })
            }else{
                alert('Veuillez activer la localisation');
            }
        };
        $scope.load= function(){
            AttenteFactory.getAttentes().success(function(msg){
                $scope.attentes = msg.data.attentes;
            })
        };
        $scope.load();
    }]);
