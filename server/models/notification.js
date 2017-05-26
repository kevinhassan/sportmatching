'use strict';
module.exports = function(sequelize, DataTypes) {
  let notification = sequelize.define('notification', {
    contenu:{
        type:DataTypes.STRING,
        allowNull:false
    }
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    // define the table's name
    tableName: 'notification',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        notification.belongsTo(models.utilisateur,{onDelete: 'cascade',onUpdate:'cascade'});//Foreign key
        notification.belongsTo(models.partie,{onDelete: 'cascade',onUpdate:'cascade'});//Foreign key
      }
    }
  });
  return notification;
};