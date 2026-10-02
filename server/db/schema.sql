

PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS line_stations;
DROP TABLE IF EXISTS lines;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

CREATE TABLE stations (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE lines (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL
);

CREATE TABLE line_stations (
  line_id    INTEGER NOT NULL REFERENCES lines(id),
  station_id INTEGER NOT NULL REFERENCES stations(id),
  position   INTEGER NOT NULL,
  PRIMARY KEY (line_id, position)
);

CREATE TABLE events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  effect      INTEGER NOT NULL CHECK (effect BETWEEN -4 AND 4)
);

CREATE TABLE users (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  name     TEXT NOT NULL,
  hash     TEXT NOT NULL,
  salt     TEXT NOT NULL
);


CREATE TABLE games (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER NOT NULL REFERENCES users(id),
  start_station_id INTEGER NOT NULL REFERENCES stations(id),
  dest_station_id  INTEGER NOT NULL REFERENCES stations(id),
  score            INTEGER,
  status           TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  created_at       TEXT NOT NULL
);
