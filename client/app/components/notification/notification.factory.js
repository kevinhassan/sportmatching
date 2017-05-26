angular.module('myApp.notificationFactory', ['ngRoute'])
    .factory('NotificationFactory', function($http,APPLINK) {

        return {
            getNotifications: function () {
                return $http.get(APPLINK + '/notifications');
            },
            deleteNotification: function(idNotification){
                return $http.delete(APPLINK + '/notifications/'+ idNotification);
            },
            countNotifications: function () {
                return $http.get(APPLINK + '/notifications/'+'count');
            }
        }
    });
