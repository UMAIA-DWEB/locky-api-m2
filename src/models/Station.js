const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Station = sequelize.define('Station', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'stations',
});

module.exports = Station;
