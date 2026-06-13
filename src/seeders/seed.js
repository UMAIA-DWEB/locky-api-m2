// seed manual com reset completo (DROP + CREATE de tabelas + dados)
// usado via `npm run seed` quando se quer comecar do zero

const { sequelize, User, Station, Locker, Reservation } = require('../models');
const {
  stationsData,
  usersData,
  buildLockersData,
  buildReservationsData,
} = require('./seedData');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Ligado à BD.');

    await sequelize.sync({ force: true });
    console.log('Tabelas recriadas.');

    const users = await User.bulkCreate(usersData);
    console.log(`${users.length} users criados.`);

    const stations = await Station.bulkCreate(stationsData);
    console.log(`${stations.length} stations criadas.`);

    const lockers = await Locker.bulkCreate(buildLockersData(stations));
    console.log(`${lockers.length} lockers criados.`);

    const reservations = await Reservation.bulkCreate(buildReservationsData(users, lockers));
    console.log(`${reservations.length} reservations criadas.`);

    process.exit(0);
  } catch (err) {
    console.error('Erro no seed:', err);
    process.exit(1);
  }
}

seed();
