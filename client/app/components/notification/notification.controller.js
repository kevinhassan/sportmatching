'use strict';

angular.module('myApp.notification', ['ngRoute','myApp.notificationFactory'])

// Declared route
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/notifications', {
            templateUrl: '/components/notification/notification.html',
            controller: 'NotificationCtrl',
            access: {
                requiredLogin: true
            }
        });
    }])

    .controller('NotificationCtrl',['$scope','NotificationFactory',function($scope,NotificationFactory){
        $scope.notifications = [];

        NotificationFactory.getNotifications().success(function(res){
            $scope.notifications = res.data.notifications;
        });
        $scope.deleteNotif = function(id){
            NotificationFactory.deleteNotification(id).success(function(){
                NotificationFactory.getNotifications().success(function(res){
                    $scope.notifications = res.data.notifications;
                });
            })
        };
    }])
    .controller('NotificationNavCtrl', ['$scope','$route','NotificationFactory',function($scope,$route,NotificationFactory){
        $scope.count = 0;

        $scope.refreshCounter = function() {
            NotificationFactory.countNotifications().success(function(res){
                $scope.count = res.data.nb_notification;
            })
        }
    }]);