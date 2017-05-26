'use strict';
module.exports = function(sequelize, DataTypes) {
  let utilisateur = sequelize.define('utilisateur', {
    nom: {
      type:DataTypes.STRING,
      allowNull: false
    },
    prenom: {
      type:DataTypes.STRING,
      allowNull: false
    },
    mail:{
      type:DataTypes.STRING,
      unique: true,
      allowNull: false,
      isEmail: true
    },
    mdp: {
      type:DataTypes.STRING,
      allowNull: false
    },
    est_admin:{
      type:DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    // define the table's name
    tableName: 'utilisateur',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        utilisateur.hasMany(models.notification,{onDelete: 'cascade',onUpdate:'cascade'});//Foreign key
      }
    }
  });
  return utilisateur;
};
