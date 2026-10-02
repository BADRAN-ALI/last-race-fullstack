'use strict';
const { all } = require('../db/db');

function getEvents() {
  return all('SELECT id, description, effect FROM events');
}

module.exports = { getEvents };
