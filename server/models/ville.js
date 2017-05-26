'use strict';
module.exports = function(sequelize, DataTypes) {
  let ville = sequelize.define('ville', {
    nom: {
        type:DataTypes.STRING,
        allowNull: false
    }
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    // define the table's name
    tableName: 'ville',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
          ville.hasMany(models.terrain,{onDelete: 'cascade',onUpdate:'cascade'});
      }
    }
  });
  return ville;
};