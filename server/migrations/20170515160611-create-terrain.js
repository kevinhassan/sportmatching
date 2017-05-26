'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('terrain', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      localisation: {
        type: Sequelize.GEOMETRY('POINT',4326),
      },
      nom: {
        type: Sequelize.STRING,
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('terrain');
  }
};