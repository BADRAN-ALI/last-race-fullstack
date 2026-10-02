'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('./passport-config');

const sessionsRouter = require('./routes/sessions');
const networkRouter = require('./routes/network');
const gamesRouter = require('./routes/games');
const rankingRouter = require('./routes/ranking');
const { ensureSeeded } = require('./db/ensureSeeded');

const app = express();
const PORT = 3001;
const CLIENT_ORIGIN = 'http://localhost:5173';

app.use(morgan('dev'));
app.use(express.json());

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

app.use(
  session({
    secret: 'last-race-dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/sessions', sessionsRouter);
app.use('/api/network', networkRouter);
app.use('/api/games', gamesRouter);
app.use('/api/ranking', rankingRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error' });
});

ensureSeeded()
  .then((seeded) => {
    if (seeded) console.log('Database was empty — schema created and seeded on startup.');
    app.listen(PORT, () => console.log(`Last Race API on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Startup seeding failed:', err);
    process.exit(1);
  });
