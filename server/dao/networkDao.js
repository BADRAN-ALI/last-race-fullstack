'use strict';
const { all } = require('../db/db');

function getStations() {
  return all('SELECT id, name FROM stations ORDER BY id');
}

function getLines() {
  return all('SELECT id, name, color FROM lines ORDER BY id');
}

function getLineStations() {
  return all('SELECT line_id, station_id, position FROM line_stations ORDER BY line_id, position');
}

module.exports = { getStations, getLines, getLineStations };
