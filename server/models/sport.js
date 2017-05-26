'use strict';
module.exports = function(sequelize, DataTypes) {
  let sport = sequelize.define('sport', {
    nom:  {
        type:DataTypes.STRING,
        allowNull: false
    },
    nbr_max_participant:  {
        type:DataTypes.INTEGER,
        allowNull: false
    }
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    // define the table's name
    tableName: 'sport',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
          sport.hasMany(models.terrain,{onDelete: 'cascade',onUpdate:'cascade'});
          sport.hasMany(models.attendre);
      }
    }
  });
  return sport;
};