angular.module('myApp.terrainFactory', ['ngRoute'])
    .factory('TerrainFactory', function($http,APPLINK) {
        return {
            addTerrain: function (terrain) {
                return $http.post(APPLINK + '/terrains',terrain);
            },
            getTerrains: function(latitude,longitude){
                return $http.get(APPLINK + '/terrains/'+'?longitude='+longitude+'&latitude='+latitude);
            }
        }
    });