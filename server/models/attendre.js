'use strict';
module.exports = function(sequelize, DataTypes) {
  let attendre = sequelize.define('attendre', {
    nbr_personne:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    date:  {
        type: DataTypes.DATE,
        allowNull: false
    },
    distance_max:   {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    localisation:{
        type: DataTypes.GEOMETRY('POINT',4326),
        allowNull: false
    }
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    // define the table's name
    tableName: 'attendre',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
          models.sport.belongsToMany(models.utilisateur,{as:'attendre',through:'attendre',onDelete: 'cascade',onUpdate:'cascade'});
          models.utilisateur.belongsToMany(models.sport,{as:'attendre',through:'attendre',onDelete: 'cascade',onUpdate:'cascade'});
          attendre.belongsTo(models.sport);
      }
    }
  });
  return attendre;
};