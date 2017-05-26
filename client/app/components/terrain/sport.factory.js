angular.module('myApp.sportFactory', ['ngRoute'])
    .factory('SportFactory', function($http,APPLINK) {
        return {
            getSports: function(){
                return $http.get(APPLINK + '/sports');
            }
        }
    });