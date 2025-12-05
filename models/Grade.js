const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Grade = sequelize.define('Grade', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  deliverableId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = Grade;