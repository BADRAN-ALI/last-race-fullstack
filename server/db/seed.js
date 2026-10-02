'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { db, run } = require('./db');

const LINES = [
  { name: 'Red',    color: '#e6194b', stations: ['Vetro', 'Centrale', 'Fucina', 'Foro', 'Torre'] },
  { name: 'Blue',   color: '#4363d8', stations: ['Lido', 'Centrale', 'Mercato', 'Aurora', 'Nord'] },
  { name: 'Green',  color: '#3cb44b', stations: ['Boschetto', 'Foro', 'Giardino', 'Miralago', 'Cala'] },
  { name: 'Yellow', color: '#ffe119', stations: ['Faro', 'Aurora', 'Pineta', 'Miralago', 'Molo'] },
];

const EVENTS = [
  { description: 'Quiet journey', effect: 0 },
  { description: 'Kind passenger gives directions', effect: 1 },
  { description: 'Busker brightens the carriage', effect: 1 },
  { description: 'Found a forgotten day-pass', effect: 2 },
  { description: 'Express service, smooth ride', effect: 3 },
  { description: 'Conductor waves you through the gates', effect: 4 },
  { description: 'Crowded carriage, lost your seat', effect: -1 },
  { description: 'Wrong platform, doubled back', effect: -2 },
  { description: 'Signal failure, long delay', effect: -3 },
  { description: 'Pickpocket on the platform', effect: -4 },
];

const USERS = [
  { username: 'alice', name: 'Alice Rossi', password: 'password' },
  { username: 'bob', name: 'Bob Bianchi', password: 'password' },
  { username: 'charlie', name: 'Charlie Verdi', password: 'password' },
];

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return { salt, hash };
}

function execSchema() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const done = new Promise((resolve, reject) => {
    db.exec(sql, (err) => (err ? reject(err) : resolve()));
  });
  return done;
}

async function seedDatabase() {
  await execSchema();

  const stationNames = [];
  for (const line of LINES) {
    for (const name of line.stations) {
      if (!stationNames.includes(name)) stationNames.push(name);
    }
  }
  const stationId = new Map();
  for (const name of stationNames) {
    const { lastID } = await run('INSERT INTO stations (name) VALUES (?)', [name]);
    stationId.set(name, lastID);
  }

  for (const line of LINES) {
    const { lastID: lineId } = await run('INSERT INTO lines (name, color) VALUES (?, ?)', [line.name, line.color]);
    for (let pos = 0; pos < line.stations.length; pos++) {
      await run(
        'INSERT INTO line_stations (line_id, station_id, position) VALUES (?, ?, ?)',
        [lineId, stationId.get(line.stations[pos]), pos]
      );
    }
  }

  for (const ev of EVENTS) {
    await run('INSERT INTO events (description, effect) VALUES (?, ?)', [ev.description, ev.effect]);
  }

  const userId = new Map();
  for (const u of USERS) {
    const { salt, hash } = hashPassword(u.password);
    const { lastID } = await run(
      'INSERT INTO users (username, name, hash, salt) VALUES (?, ?, ?, ?)',
      [u.username, u.name, hash, salt]
    );
    userId.set(u.username, lastID);
  }

  
  const sId = (name) => stationId.get(name);
  const playedGames = [
    { user: 'alice', start: 'Vetro', dest: 'Aurora', score: 24, status: 'completed', day: '2026-06-10' },
    { user: 'alice', start: 'Lido', dest: 'Torre', score: 18, status: 'completed', day: '2026-06-12' },
    { user: 'alice', start: 'Boschetto', dest: 'Nord', score: 0, status: 'failed', day: '2026-06-13' },
    { user: 'bob', start: 'Faro', dest: 'Centrale', score: 27, status: 'completed', day: '2026-06-11' },
    { user: 'bob', start: 'Cala', dest: 'Vetro', score: 15, status: 'completed', day: '2026-06-14' },
    { user: 'charlie', start: 'Faro', dest: 'Torre', score: 21, status: 'completed', day: '2026-06-15' },
    { user: 'charlie', start: 'Lido', dest: 'Cala', score: 17, status: 'completed', day: '2026-06-16' },
  ];
  for (const g of playedGames) {
    await run(
      'INSERT INTO games (user_id, start_station_id, dest_station_id, score, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [userId.get(g.user), sId(g.start), sId(g.dest), g.score, g.status, `${g.day}T12:00:00.000Z`]
    );
  }

  return {
    stations: stationNames.length,
    lines: LINES.length,
    events: EVENTS.length,
    users: USERS.length,
    games: playedGames.length,
  };
}

module.exports = { seedDatabase };

if (require.main === module) {
  seedDatabase()
    .then((s) => {
      console.log(
        `Seeded: ${s.stations} stations, ${s.lines} lines, ${s.events} events, ` +
        `${s.users} users, ${s.games} games.`
      );
      db.close();
    })
    .catch((err) => {
      console.error('Seed failed:', err);
      db.close();
      process.exit(1);
    });
}
