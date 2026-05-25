const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  githubId: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
}, {
  tableName: 'users',
});

module.exports = User;
