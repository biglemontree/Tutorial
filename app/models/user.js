'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('Users', {
    nickname: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};