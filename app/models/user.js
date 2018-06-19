// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   var User = sequelize.define('Users', {
//     nickname: DataTypes.STRING
//   }, {
//     classMethods: {
//       associate: function(models) {
//         // associations can be defined here
//       }
//     }
//   });
//   return User;
// };

var Sequelize = require('sequelize');
var sequelize = new Sequelize('testDB', 'root', null, {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
    storage: "../../testDB.sqlite"
});

sequelize
    .authenticate()
    .then(function (err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

var User = sequelize.define('user', {
    nickname: Sequelize.STRING
}, {
    classMethods: {
        associate: function (models) {
            // associations can be defined here
        }
    }
});

// force: true will drop the table if it already exists
User.sync({
    force: true
}).then(function () {
    // Table created
    return User.create({
        nickname: 'tangtang'
    });
});

User.findAll().then(function (users) {
    console.log(users)
})