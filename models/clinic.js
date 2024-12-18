'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Clinic extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       Clinic.hasMany(models.patients, {as: 'Patients', foreignKey: 'clinicId'});
//     }
//   };
//   Clinic.init({
//     title: DataTypes.STRING,
//     date: DataTypes.DATE,
//     desiredAttendance: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'clinic',
//     tableName: 'clinic'
//   });
//   return Clinic;
// };

const {DataTypes} = require('sequelize');
const { db: { sequelize } } = require('./index');
const clinic = sequelize.define('clinic', {
  // Model attributes are defined here
  id: {
    field: 'id',
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING
  },
  date: {
    type: DataTypes.DATE,
  },
  desiredAttendance: {
    type: DataTypes.INTEGER
  },
  psychiatrist: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }

}, {
  timestamps: true,
  modelName: 'clinic',
  tableName: 'clinic'
  // Other model options go here
});

module.exports.clinic = clinic;
