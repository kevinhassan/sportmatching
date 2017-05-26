angular.module('myApp.registerFactory', ['ngRoute'])
    .factory('RegisterFactory', function($http,APPLINK) {
        return {
            addUtilisateur: function (utilisateur) {

                return $http.post(APPLINK + '/register',utilisateur);
            }
        }
    });