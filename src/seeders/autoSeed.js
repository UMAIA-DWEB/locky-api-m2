const { Station, User, Locker, Reservation } = require('../models');
const {
  stationsData,
  usersData,
  buildLockersData,
  buildReservationsData,
} = require('./seedData');

// popula a DB apenas se ja nao tiver dados
async function autoSeedIfEmpty() {
  const stationCount = await Station.count();
  if (stationCount > 0) {
    console.log(`DB ja tem ${stationCount} stations, skip seed.`);
    return;
  }

  console.log('DB vazia, a popular com dados iniciais...');

  const users = await User.bulkCreate(usersData);
  const stations = await Station.bulkCreate(stationsData);
  const lockers = await Locker.bulkCreate(buildLockersData(stations));
  const reservations = await Reservation.bulkCreate(buildReservationsData(users, lockers));

  console.log(`Seed automatico: ${stations.length} stations, ${lockers.length} lockers, ${users.length} users, ${reservations.length} reservations.`);
}

module.exports = autoSeedIfEmpty;
