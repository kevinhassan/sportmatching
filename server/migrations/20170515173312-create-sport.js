'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('sport', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
          allowNull: false,
          type: Sequelize.STRING
      },
      nbr_max_participant:{
          allowNull: false,
          type: Sequelize.INTEGER,
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('sport');
  }
};