'use strict';
const express = require('express');
const { loadNetwork } = require('../game/network');
const { isLoggedIn } = require('../middleware');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const net = await loadNetwork();
    res.json({
      stations: net.stations,
      lines: net.lines.map((l) => ({ id: l.id, name: l.name, color: l.color, stations: l.stations })),
      segments: net.segments, 
      interchanges: [...net.interchanges],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
