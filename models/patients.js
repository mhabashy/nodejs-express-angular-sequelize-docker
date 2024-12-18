'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Patients extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       Patients.belongsTo(models.clinic);
//     }
//   };
//   Patients.init({
//     firstName: DataTypes.STRING,
//     lastName: DataTypes.STRING,
//     dateofBirth: DataTypes.STRING,
//     age: DataTypes.INTEGER,
//     name: DataTypes.STRING,
//     phone: DataTypes.STRING,
//     email: DataTypes.STRING,
//     refills: DataTypes.BOOLEAN,
//     online: DataTypes.BOOLEAN,
//     contactType: DataTypes.STRING,
//     clinicId: DataTypes.INTEGER,
//     isNew: DataTypes.BOOLEAN
//   }, {
//     sequelize,
//     modelName: 'patients',
//     tableName: 'patients'
//   });
//   return Patients;
// };

const {DataTypes} = require('sequelize');
const { db: { sequelize } } = require('./index');
const patients = sequelize.define('patients', {
  // Model attributes are defined here

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      refills: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      online: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      contactType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      clinicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isNew: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zipcode: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      generalQuestion: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
}, {
  timestamps: true,
  modelName: 'patients',
  tableName: 'patients'
  // Other model options go here
});

module.exports.patients = patients;
