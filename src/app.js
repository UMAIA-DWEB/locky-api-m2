const express = require('express');
const cors = require('cors');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const passport = require('./config/passport');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./middleware/logUser'));

app.get('/', (req, res) => {
  res.json({
    name: 'LockyAPI',
    version: '1.0.0',
    description: 'Sistema de gestão de cacifos inteligentes',
    docs: '/api/docs',
    auth: '/auth/github',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth',             require('./routes/auth'));
app.use('/api/stations',     require('./routes/stations'));
app.use('/api/lockers',      require('./routes/lockers'));
app.use('/api/reservations', require('./routes/reservations'));

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
  });
});

module.exports = app;
