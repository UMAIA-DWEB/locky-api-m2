const express = require('express');
const cors = require('cors');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const passport = require('./config/passport');
require('dotenv').config();

const app = express();

// CORS com credentials para o frontend React
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // permitir requests sem origin (postman, por exemplo) e os origins na whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} não permitido por CORS`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isProd = process.env.NODE_ENV === 'production';

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    // em prod, frontend e API partilham origem (Nginx proxy) ---> sameSite lax basta
    // em dev, frontend está noutra porta ---> sameSite none + secure
    sameSite: isProd ? 'lax' : 'none',
    secure: isProd ? false : true,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./middleware/logUser'));

app.get('/', (req, res) => {
  res.json({
    name: 'LockyAPI',
    version: '2.0.0',
    description: 'Sistema de gestão de cacifos inteligentes (com Frontend)',
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
