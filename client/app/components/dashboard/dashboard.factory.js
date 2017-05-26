angular.module('myApp.dashboardFactory', ['ngRoute'])
    .factory('DashboardUtilisateurFactory', function($http,APPLINK) {

        return {
            getUtilisateurs: function () {
                return $http.get(APPLINK + '/utilisateurs');
            },
            updatePermission: function(id,newPermission){
                return $http.put(APPLINK + '/utilisateurs/'+id,{
                    "est_admin": newPermission
                });
            },
            deleteUtilisateur: function(id){
                return $http.delete(APPLINK + '/utilisateurs/'+id);
            }
        }
    })
    .factory('DashboardVilleFactory', function($http,APPLINK) {

        return {
            getVilles: function () {
                return $http.get(APPLINK + '/villes');
            },
            deleteVille: function (id) {
                return $http.delete(APPLINK + '/villes/' + id);
            },
            getTerrains: function (id){
                return $http.get(APPLINK + '/villes/'+id);
            }
        }
    })
    .factory('DashboardTerrainFactory', function($http,APPLINK) {

        return {
            getTerrains: function (id_ville) {
                return $http.get(APPLINK + '/villes/'+id_ville+'/terrains/');
            },
            deleteTerrain: function (id_terrain) {
                return $http.delete(APPLINK + '/terrains/' + id_terrain);
            }
        }
    });

