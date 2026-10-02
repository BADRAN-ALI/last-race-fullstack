'use strict';

const { get } = require('../db/db');

function getUserByUsername(username) {
  return get('SELECT * FROM users WHERE username = ?', [username]);
}

function getUserById(id) {
  return get('SELECT id, username, name FROM users WHERE id = ?', [id]);
}

module.exports = { getUserByUsername, getUserById };