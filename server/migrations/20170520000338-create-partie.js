'use strict';
let trigger = require('../database/trigger_partie.sql');
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('partie', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nbr_participant: {
        type: Sequelize.INTEGER
      },
      heure_prise:{
        type: Sequelize.DATE
      },
      heure_rendu:{
        type: Sequelize.DATE
      }
    }).then(()=>{
        Sequelize.query(trigger);
    })
  },
  down: function(queryInterface, Sequelize) {
      Sequelize.query('DROP TRIGGER IF EXISTS after_insert_partie ON partie;DROP FUNCTION IF EXISTS check_partie_nbr()');
      Sequelize.query('DROP TRIGGER IF EXISTS after_insert_partie ON partie');
      return queryInterface.dropTable('partie');
  }
};
