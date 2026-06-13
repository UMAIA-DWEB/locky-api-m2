const app = require('./app');
const { sequelize } = require('./models');
const autoSeedIfEmpty = require('./seeders/autoSeed');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Ligado ao MySQL');

    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados');

    await autoSeedIfEmpty();

    app.listen(PORT, () => {
      console.log(`LockyAPI a correr em http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Erro ao arrancar:', err);
    process.exit(1);
  }
}

start();
