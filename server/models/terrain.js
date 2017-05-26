'use strict';
module.exports = function(sequelize, DataTypes) {
  let terrain = sequelize.define('terrain', {
    localisation:{
        type: DataTypes.GEOMETRY('POINT',4326),
        allowNull: false,
        unique: true
    },
    nom: {
        type:DataTypes.STRING,
        allowNull: true
    }
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    // define the table's name
    tableName: 'terrain',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        terrain.belongsTo(models.ville,{onDelete: 'cascade',onUpdate:'cascade'});
        terrain.belongsTo(models.sport,{onDelete: 'cascade',onUpdate:'cascade'});
        terrain.hasMany(models.partie);
      }
    }
  });
  return terrain;
};
