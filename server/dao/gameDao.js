'use strict';
const { all, get, run } = require('../db/db');

async function createGame(userId, startId, destId, createdAt) {
  const { lastID } = await run(
    `INSERT INTO games (user_id, start_station_id, dest_station_id, score, status, created_at)
     VALUES (?, ?, ?, NULL, 'pending', ?)`,
    [userId, startId, destId, createdAt]
  );
  return lastID;
}

function getGame(id) {
  return get('SELECT * FROM games WHERE id = ?', [id]);
}

function finalizeGame(id, score, status) {
  return run('UPDATE games SET score = ?, status = ? WHERE id = ?', [score, status, id]);
}

function getRanking() {
  return all(
    `SELECT u.username, u.name, MAX(g.score) AS bestScore
       FROM users u
       JOIN games g ON g.user_id = u.id
      WHERE g.status IN ('completed', 'failed')
      GROUP BY u.id
      ORDER BY bestScore DESC, u.username ASC`
  );
}

module.exports = { createGame, getGame, finalizeGame, getRanking };
