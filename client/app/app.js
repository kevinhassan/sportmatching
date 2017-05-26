'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
'ngRoute',
'myApp.home',
'myApp.register',
'myApp.auth',
'myApp.notification',
'myApp.profile',
'myApp.dashboard',
'myApp.attente',
'myApp.partie'
])
.constant('APPLINK','http://localhost:5050/api/v1')
.config(function($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
})
.controller("main", ['$scope', '$location', 'UserAuthFactory','AuthenticationFactory',
    function($scope, $location, UserAuthFactory,AuthenticationFactory) {

        $scope.isActive = function(route) {
            return route === $location.path();
        };

        $scope.logout = function () {
            UserAuthFactory.logout();
        }
    }
])
.run(function($rootScope, $window, $location, AuthenticationFactory) {
    // when the page refreshes, check if the user is already logged in
    AuthenticationFactory.check();

    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        if ((nextRoute && nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
            $location.path("/login");
        } else if (nextRoute === undefined){
            console.log('existe pas');
          $location.path("/erreur");
        } else {
            // check if user object exists else fetch it. This is incase of a page refresh
            if (!AuthenticationFactory.utilisateur) AuthenticationFactory.utilisateur = $window.sessionStorage.utilisateur;
        }
    });

    $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
        $rootScope.showMenu = AuthenticationFactory.isLogged;
        $rootScope.showMenuAdmin = AuthenticationFactory.isAdmin;
        // if the user is already logged in, take him to the home page
        if (AuthenticationFactory.isLogged === true && $location.path() === '/login') {
            $location.path('/');
        }
    });
});