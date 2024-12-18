'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Users extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   Users.init({
//     firstName: DataTypes.STRING,
//     lastName: DataTypes.STRING,
//     username: DataTypes.STRING,
//     password: DataTypes.STRING,
//     sessionId: DataTypes.STRING,
//   }, {
//     sequelize,
//     modelName: 'users',
//     tableName: 'users',
//     primaryKeyAttribute: 'id'
//   });
//   return Users;
// };
const {DataTypes} = require('sequelize');
const { db: { sequelize } } = require('./index');
const user = sequelize.define('user', {
  // Model attributes are defined here
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      sessionId: {
        type: DataTypes.STRING,
      },
}, {
  timestamps: true,
  modelName: 'users',
  tableName: 'users',
  // Other model options go here
});

module.exports.user = user;
