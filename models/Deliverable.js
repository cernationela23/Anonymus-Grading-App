const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Deliverable = sequelize.define('Deliverable', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deploymentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Deliverable;