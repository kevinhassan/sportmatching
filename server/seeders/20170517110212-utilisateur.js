'use strict';
let crypt = require('../config/crypt');

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
      return queryInterface.bulkInsert('utilisateur', [{
          id: 1,
          nom: 'Hassan',
          prenom: 'Kévin',
          mail: 'kevin.hassan@etu.umontpellier.fr',
          mdp: crypt.encrypt('test'),
          est_admin: true
      },{
          id:2,
          nom: 'Agbodjogbe',
          prenom: 'Yves-Alain',
          mail: 'yves.alain@etu.umontpellier.fr',
          mdp: crypt.encrypt('test'),
          est_admin: false
      }], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('utilisateur', [{id:[1,2]}], {});
  }
};
