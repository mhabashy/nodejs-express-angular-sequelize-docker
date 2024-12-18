const { db } = require('./index');
const {clinic} = require('./clinic');
const {patients} = require('./patients');
const {user} = require('./users');

const tables = db;

clinic.hasMany(patients, {as: 'Patients', foreignKey: 'clinicId'});
patients.belongsTo(clinic);

tables.Clinic = clinic;
tables.Patients = patients;
tables.Users = user;


module.exports = tables;
