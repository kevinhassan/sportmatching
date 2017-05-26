'use strict';

angular.module('myApp.home', ['ngRoute','myApp.terrainFactory','myApp.sportFactory'])

// Declared route
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/components/home/home.html',
            controller: 'HomeCtrl',
            access: {
                requiredLogin: false
            }
        })
        .when('/home-connect', {
                templateUrl: '/components/home/home-connected.html',
                controller: 'HomeConnectedCtrl',
                access: {
                    requiredLogin: true
            }
        })
        .otherwise({
            templateUrl: '/components/erreur/erreur.html',
            access: {
                requiredLogin: false
            }
        })
    }]).controller('HomeCtrl', function($scope, $location, $anchorScroll) {
    $scope.scrollTo = function(id,) {
        $location.hash(id);
        $anchorScroll();
    };
    $scope.load = function() {
        $( "#animatedArrow" ).hover(function() {
            $(this).children('i')
                .transition('set looping')
                .transition('pulse', '500ms');
        },function(){
            $(this).children('i')
            .transition('remove looping');
        });
    };
    $scope.load();
    })

    .controller('HomeConnectedCtrl',['$scope','$compile','TerrainFactory','SportFactory', function($scope,$compile,TerrainFactory,SportFactory) {
        $scope.coords = {
            longitude: "",
            latitude: ""
        };
        var map = L.map( 'mapid', {
            minZoom: 10,
            zoom: 20
        });

        var myposition_icon = L.icon({
            iconUrl: 'assets/img/icon-myposition.png',
            iconSize:     [25, 25], // size of the icon
        });
        var foot_icon = L.icon({
            iconUrl: 'assets/img/football.png',
            iconSize:     [25, 25], // size of the icon
        });
        var basket_icon = L.icon({
            iconUrl: 'assets/img/basketball.png',
            iconSize:     [25, 25], // size of the icon
        });
        var basketLayer =  L.layerGroup();
        var footLayer =  L.layerGroup();


        $scope.load = function(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {

                    map.setView([position.coords.latitude, position.coords.longitude], 20);
                    L.easyButton('fa-compass', function(btn, map){
                        map.setView([position.coords.latitude, position.coords.longitude], 20);
                    }).addTo( map );

                    L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                        subdomains: ['a','b','c']
                    }).addTo( map );
                    L.marker([position.coords.latitude, position.coords.longitude], {icon: myposition_icon}).addTo(map).bindPopup("Vous vous trouvez ici !");
                    //Ajouter tous les marqueurs d'une ville
                    TerrainFactory.getTerrains(position.coords.latitude,position.coords.longitude).success(function(res){
                        var terrains = res.data;
                        terrains.map(function(terrain){
                            //Ajouter un ng-click au popup
                            var newScope = $scope.$new();
                            var linkFunction;
                            if(terrain.parties.length>0){
                                terrain.jouer="Oui";
                                var button = '<p><a href="#parties/" class="ui green button" title="Retenez l\'id du terrain">Rejoindre</a></p>';
                            }else{
                                terrain.jouer="Non";
                                var button = '<p><a href="#parties/" class="ui green button" title="Retenez l\'id du terrain">Jouer</a></p>';
                            }
                            if(terrain.nom === null)
                                terrain.nom = "";
                            if(terrain.sport_id === 1){
                                var basketPoint = L.marker([terrain.localisation.coordinates[1], terrain.localisation.coordinates[0]], {icon: basket_icon}).addTo(basketLayer).bindPopup(
                                    "<p><label>Nom: </label>" + terrain.nom + "<p><label>ID Terrain: </label>" + terrain.id + "</p><p><label>Sport: </label>" + terrain.sport.nom + "</p><p><label>Ville: </label>"+terrain.ville.nom+"</p>"+"</p><p><label>Partie en cours: </label>"+terrain.jouer + button
                                );
                            }
                            else {
                                var footPoint = L.marker([terrain.localisation.coordinates[1], terrain.localisation.coordinates[0]], {icon: foot_icon}).addTo(footLayer).bindPopup(
                                    "<p><label>Nom: </label>" + terrain.nom + "<p><label>ID Terrain: </label>" + terrain.id + "</p><p><label>Sport: </label>" + terrain.sport.nom + "</p><p><label>Ville: </label>"+terrain.ville.nom+"</p>"+"</p><p><label>Partie en cours: </label>"+terrain.jouer + button
                                );
                            }
                        });
                    });

                    var overlayMaps = {
                        "Basketball": basketLayer,
                        "Football": footLayer
                    };
                    L.control.layers(overlayMaps).addTo(map);
                    map.on('click', addMarker);

                });
            } else {
                alert("La géolocalisation n'est pas supportée");
            }
        };
        $scope.load();
        $scope.isShow=false;
        $scope.sports=[];
        SportFactory.getSports().success(function (res) {
            $scope.$watch('sports',function(){
                $scope.sports = res.data.sports;
            })
        });
        var temp_marker;
        var marker=[];
        function addMarker (e){
            if(temp_marker){//Si on avait déjà marqué un endroit on supprime l'ancien marqueur
                map.removeLayer(temp_marker);
            }
            temp_marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);//Ajouter marqueur
            $scope.coords.latitude =e.latlng.lat;
            $scope.coords.longitude = e.latlng.lng;
            $scope.$apply(function(){
                if(!$scope.isShow){
                    $scope.isShow = true;
                }
            });
        }
        $scope.addTerrain = function(){
            if($scope.terrain !== undefined && $scope.terrain.sport !== undefined){
                $scope.terrain.sport_id = $scope.terrain.sport.id;
                $scope.terrain.localisation={
                    latitude:$scope.coords.latitude,
                    longitude:$scope.coords.longitude
                };
                marker.push($scope.terrain);//Garder en sauvegarde les terrains enregistré permet de réduire les requêtes inutiles
                if(!$scope.terrain.nom){
                    $scope.terrain.nom = "";
                }
                var button = '<p><a href="#parties/" class="ui green button" title="Retenez l\'id du terrain">Jouer</a></p>';
                if($scope.terrain.sport_id === 1){
                    L.marker([$scope.coords.latitude, $scope.coords.longitude], {icon: basket_icon}).addTo(basketLayer).bindPopup(
                        "<p><label>Nom: </label>" + $scope.terrain.nom + "</p><p><label>Sport: </label>" + $scope.terrain.sport.nom + "</p><p><label>Partie en cours: </label>Non</p>"+button
                    );
                }
                else
                    L.marker([$scope.coords.latitude, $scope.coords.longitude], {icon: foot_icon}).addTo(footLayer).bindPopup(
                        "<p><label>Nom: </label>" +$scope.terrain.nom + "</p><p><label>Sport: </label>" + $scope.terrain.sport.nom + "</p><p><label>Partie en cours: </label>Non</p>"+ button
                    );
                delete $scope.terrain.sport;
                TerrainFactory.addTerrain($scope.terrain).success(function(res){
                    alert('Terrain crée avec succès !');
                 }).error(function(){
                     alert('Le terrain n\'a pas pu être crée');
                 });
            }else{
                map.removeLayer(temp_marker);
                alert('Formulaire invalide');
            }
            $scope.terrain = {};
            $scope.isShow = false;
        };
        $scope.addPartie = function(id_terrain){
            console.log('lol',id_terrain);
        };
        $scope.joinPartie = function(id_terrain){
            console.log('test',id_terrain);
        }
    }]);