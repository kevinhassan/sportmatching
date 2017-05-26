angular.module('myApp.partieFactory', ['ngRoute'])
    .factory('PartieFactory', function($http,APPLINK) {

        return {
            getParties: function () {
                return $http.get(APPLINK + '/parties');
            },
            deletePartie: function(idPartie){
                return $http.delete(APPLINK + '/parties/'+ idPartie);
            },
            addPartie: function (data) {
                return $http.post(APPLINK + '/parties/',data);
            }
        }
    });
