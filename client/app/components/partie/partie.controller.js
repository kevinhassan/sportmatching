'use strict';

angular.module('myApp.partie', ['ngRoute','myApp.partieFactory','myApp.dashboard'])

// Declared route
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/parties', {
            templateUrl: '/components/partie/partie.html',
            controller: 'PartieCtrl',
            access: {
                requiredLogin: true
            }
        });
    }])

    .controller('PartieCtrl',['$scope','PartieFactory',function($scope,PartieFactory){
        $scope.parties = [];
        $scope.partie = {};
        $scope.partie.heure_rendu = moment().second(0).milliseconds(0).toDate();
        $scope.partie.heure_prise = moment().second(0).milliseconds(0).toDate();

        $scope.load = function(){
            PartieFactory.getParties().success(function(msg){
                $scope.parties = msg.data.parties;
            });
        };
        $scope.load();
        $scope.selectAll = function(){
            $('#selectAll').addClass('disabled');
            $('#deselectAll').removeClass('disabled');
            $('.slider.checkbox input[type="checkbox"]').prop('checked', true);
            $scope.parties.map(function(partie){
                partie.selected = true;
            })
        };
        $scope.deselectAll = function(){
            $('#selectAll').removeClass('disabled');
            $('#deselectAll').addClass('disabled');
            $('.slider.checkbox input[type="checkbox"]').prop('checked', false);
            $scope.parties.map(function(partie){
                partie.selected = false;
            })
        };
        $scope.supprimerParties = function(){
            $scope.parties.map(function(partie){
                if(partie.selected){
                    PartieFactory.deletePartie(partie.id).success(function(res){
                        var index = $scope.parties.indexOf(partie);
                        $scope.parties.splice(index, 1);
                    });
                }
            })
        };
        $scope.addPartie = function(){
            if($scope.partie.heure_rendu && $scope.partie.heure_prise &&($scope.partie.heure_rendu > $scope.partie.heure_prise)&& ($scope.partie.terrain_id && $scope.partie.terrain_id>0) && ($scope.partie.nbr_participant && $scope.partie.nbr_participant >0)) {
                PartieFactory.addPartie($scope.partie).success(function (res) {
                    $scope.parties.push($scope.partie);
                    alert(res.message);
                }).error(function(msg){
                    alert(msg.message);
                })
            }else{
                alert('Erreur dans le formulaire');
            }
        }
    }]);
