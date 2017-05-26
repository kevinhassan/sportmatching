angular.module('myApp.attenteFactory', ['ngRoute'])
    .factory('AttenteFactory', function($http,APPLINK) {

        return {
            addAttente: function(attente){
                return $http.post(APPLINK + '/attentes',attente);
            },
            getAttentes: function(){
                return $http.get(APPLINK + '/attentes');
            },
            deleteAttente: function(sport_id){
                return $http.delete(APPLINK + '/attentes/'+sport_id);
            }
        }
    });