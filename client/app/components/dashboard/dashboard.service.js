angular.module('myApp.dashboardService', ['ngRoute']).service('DashboardVilleService', function() {
    var ville = {
        id: ""
    };
    return {
        addVille : function (id_ville) {
            ville.id = id_ville;
        },
        getVilleId : function () {
            return ville.id;
        }
    }
});