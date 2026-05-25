const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Locker = sequelize.define('Locker', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  stationId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  size: {
    type: DataTypes.ENUM('S', 'M', 'L'),
    allowNull: false,
  },
  pricePerHour: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
}, {
  tableName: 'lockers',
});

module.exports = Locker;
