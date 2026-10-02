'use strict';

const { get } = require('./db');
const { seedDatabase } = require('./seed');

async function ensureSeeded() {
  try {
    const row = await get('SELECT COUNT(*) AS n FROM stations');
    if (row && row.n > 0) return false; 
  } catch {
  }
  await seedDatabase();
  return true;
}

module.exports = { ensureSeeded };
