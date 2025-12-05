const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Student = sequelize.define('Student', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: { 
    type: DataTypes.STRING, 
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: { 
    type: DataTypes.ENUM('MP', 'JURAT', 'PROFESOR'), 
    defaultValue: 'MP' 
  }
});

module.exports = Student;