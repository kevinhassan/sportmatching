angular.module('myApp.profileFactory', ['ngRoute'])
    .factory('ProfileFactory', function($http,APPLINK) {
        return {
            getProfile: function () {
                return $http.get(APPLINK + '/utilisateurs/monprofil');
            },
            updateProfile: function(id_utilisateur,data){
                return $http.put(APPLINK + '/utilisateurs/'+ id_utilisateur,data);
            }
        }
    });