const sequelize = require('../config/database');

const User = require('./User');
const Station = require('./Station');
const Locker = require('./Locker');
const Reservation = require('./Reservation');

Station.hasMany(Locker, { foreignKey: 'stationId', as: 'lockers' });
Locker.belongsTo(Station, { foreignKey: 'stationId', as: 'station' });

Locker.hasMany(Reservation, { foreignKey: 'lockerId', as: 'reservations' });
Reservation.belongsTo(Locker, { foreignKey: 'lockerId', as: 'locker' });

User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Station,
  Locker,
  Reservation,
};
