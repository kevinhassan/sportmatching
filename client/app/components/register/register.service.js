angular.module('myApp.registerService', ['ngRoute']).service('RegisterService', function() {
    var utilisateur = {
        mail: ""
    };

    return {
        addUtilisateur : function (utilisateurAdded) {
            utilisateur.mail = utilisateurAdded.mail;
        },
        getUtilisateurMail : function () {
            return utilisateur.mail;
        }
    }
});