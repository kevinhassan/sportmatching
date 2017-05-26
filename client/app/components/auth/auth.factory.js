angular.module('myApp.authFactory', ['ngRoute'])
    .factory('AuthenticationFactory', function($window) {
    var auth = {
        isLogged: false,
        isAdmin: false,
        check: function() {
            if ($window.sessionStorage.token) {
                this.isLogged = true;
            } else {
                this.isLogged = false;
                this.isAdmin = false;
            }
        }
    };

    return auth;
})
    .factory('UserAuthFactory', function($window, $location, $http, AuthenticationFactory,APPLINK) {
    return {
        login: function(mail, mdp) {
            return $http.post(APPLINK+'/login', {
                mail: mail,
                mdp: mdp
            });
        },
        logout: function() {

            if (AuthenticationFactory.isLogged) {

                AuthenticationFactory.isLogged = false;
                AuthenticationFactory.isAdmin = false;

                delete $window.sessionStorage.token;

                $location.path("/");
            }

        }
    }
})

    .factory('TokenInterceptor', function($q, $window) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers['X-Access-Token'] = $window.sessionStorage.token;
                config.headers['Content-Type'] = "application/json";
            }
            return config || $q.when(config);
        },

        response: function(response) {
            return response || $q.when(response);
        }
    };
});