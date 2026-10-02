'use strict';


const sqlite3 = require('sqlite3');
const path = require('path');

const DB_FILE = path.join(__dirname, 'lastrace.sqlite');

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) throw err;
  db.run('PRAGMA foreign_keys = ON');
});

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

module.exports = { db, all, get, run, DB_FILE };
