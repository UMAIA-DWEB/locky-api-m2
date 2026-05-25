const { sequelize, User, Station, Locker, Reservation } = require('../models');

const stationsData = [
  { name: 'Centro Colombo',                  address: 'Av. Lusíada, 1500-392',                city: 'Lisboa' },
  { name: 'NorteShopping',                   address: 'R. Sara Afonso 105-117',                city: 'Matosinhos' },
  { name: 'ViaCatarina Shopping',            address: 'R. de Santa Catarina 312-350',          city: 'Porto' },
  { name: 'Centro Vasco da Gama',            address: 'Av. D. João II',                        city: 'Lisboa' },
  { name: 'CascaiShopping',                  address: 'EN 9, Alcabideche',                     city: 'Cascais' },
  { name: 'UBBO',                            address: 'R. das Nogueiras',                      city: 'Amadora' },
  { name: 'Almada Fórum',                    address: 'R. Sérgio Malpique',                    city: 'Almada' },
  { name: 'Forum Algarve',                   address: 'EN 125, Sítio das Figuras',             city: 'Faro' },
  { name: 'AlgarveShopping',                 address: 'EN 125, Guia',                          city: 'Albufeira' },
  { name: 'MAR Shopping Algarve',            address: 'Sítio de Cortelha, Loulé',              city: 'Loulé' },
  { name: 'ArrábidaShopping',                address: 'Pr. de Arrábida 50',                    city: 'Vila Nova de Gaia' },
  { name: 'GaiaShopping',                    address: 'R. de Nuno Álvares Pereira',            city: 'Vila Nova de Gaia' },
  { name: 'El Corte Inglés Lisboa',          address: 'Av. António Augusto de Aguiar 31',      city: 'Lisboa' },
  { name: 'Amoreiras Shopping',              address: 'Av. Eng. Duarte Pacheco',               city: 'Lisboa' },
  { name: 'Estação do Oriente',              address: 'Av. Dom João II',                       city: 'Lisboa' },
  { name: 'Estação de Sete Rios',            address: 'Pr. Marechal Humberto Delgado',         city: 'Lisboa' },
  { name: 'Estação de Campanhã',             address: 'Largo da Estação de Campanhã',          city: 'Porto' },
  { name: 'Estação de São Bento',            address: 'Pr. de Almeida Garrett',                city: 'Porto' },
  { name: 'Estação de Aveiro',               address: 'Largo da Estação',                      city: 'Aveiro' },
  { name: 'Estação de Coimbra-B',            address: 'Av. Emídio Navarro',                    city: 'Coimbra' },
  { name: 'Estação de Faro',                 address: 'Largo da Estação',                      city: 'Faro' },
  { name: 'Aeroporto Humberto Delgado',      address: 'Alameda das Comunidades Portuguesas',   city: 'Lisboa' },
  { name: 'Aeroporto Francisco Sá Carneiro', address: 'EN 107',                                city: 'Maia' },
  { name: 'Aeroporto de Faro',               address: 'EN 125-10',                             city: 'Faro' },
  { name: 'Estação do Rossio',               address: 'Pr. Dom Pedro IV',                      city: 'Lisboa' },
  { name: 'Estação Cais do Sodré',           address: 'Pr. Duque da Terceira',                 city: 'Lisboa' },
  { name: 'Glicínias Plaza',                 address: 'R. Dom Manuel Barbuda e Vasconcelos',   city: 'Aveiro' },
  { name: 'Forum Aveiro',                    address: 'R. do Batalhão de Caçadores',           city: 'Aveiro' },
  { name: 'RioSul Shopping',                 address: 'R. Mário Castelhano',                   city: 'Seixal' },
  { name: 'LeiriaShopping',                  address: 'Av. Dr. Marcelo Caetano',               city: 'Leiria' },
];

const usersData = [];
for (let i = 1; i <= 30; i++) {
  const n = String(i).padStart(3, '0');
  usersData.push({
    githubId: `seed_user_${n}`,
    username: `user_${n}`,
    email: `user_${n}@example.pt`,
  });
}

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

    const lockersData = [];
    const sizes = [
      { size: 'S', pricePerHour: 1.50 },
      { size: 'M', pricePerHour: 2.50 },
      { size: 'L', pricePerHour: 4.00 },
    ];
    stations.forEach((station) => {
      sizes.forEach((s, j) => {
        lockersData.push({
          stationId: station.id,
          number: `L${String(j + 1).padStart(2, '0')}`,
          size: s.size,
          pricePerHour: s.pricePerHour,
        });
      });
    });
    const lockers = await Locker.bulkCreate(lockersData);
    console.log(`${lockers.length} lockers criados.`);

    const HOUR = 60 * 60 * 1000;
    const DAY = 24 * HOUR;
    const now = Date.now();
    const reservationsData = users.map((user, i) => {
      const locker = lockers[(i * 3) % lockers.length];
      const start = new Date(now + i * DAY);
      const hours = 2 + (i % 6);
      const end = new Date(start.getTime() + hours * HOUR);
      return {
        userId: user.id,
        lockerId: locker.id,
        startTime: start,
        endTime: end,
        totalPrice: Number((locker.pricePerHour * hours).toFixed(2)),
      };
    });
    const reservations = await Reservation.bulkCreate(reservationsData);
    console.log(`${reservations.length} reservations criadas.`);

    process.exit(0);
  } catch (err) {
    console.error('Erro no seed:', err);
    process.exit(1);
  }
}

seed();
