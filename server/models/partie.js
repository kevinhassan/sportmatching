'use strict';
module.exports = function(sequelize, DataTypes) {
  var partie = sequelize.define('partie', {
    nbr_participant: {
        type:DataTypes.INTEGER,
        allowNull: false
    },
    heure_prise: {
      type: DataTypes.DATE,
      allowNull: false
    },
    heure_rendu:{
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      // define the table's name
      tableName: 'partie',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
          models.partie.belongsTo(models.terrain,{onDelete: 'cascade',onUpdate:'cascade'});
          models.partie.belongsTo(models.utilisateur,{onDelete: 'cascade',onUpdate:'cascade'});
          partie.hasMany(models.notification,{onDelete: 'cascade',onUpdate:'cascade'});//Foreign key
      }
    }
  });
  return partie;
};
