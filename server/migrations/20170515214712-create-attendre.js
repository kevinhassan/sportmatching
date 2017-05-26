'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('attendre', {
      nbr_personne: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      distance_max: {
        type: Sequelize.INTEGER
      },
      localisation: {
        type: Sequelize.GEOMETRY('POINT',4326)
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('attendre');
  }
};