'use strict';
const express = require('express');
const { param, body, validationResult } = require('express-validator');
const { loadNetwork } = require('../game/network');
const { assignStartDest, simulateRoute } = require('../game/play');
const { validateRoute } = require('../game/routeValidation');
const { isLoggedIn } = require('../middleware');
const gameDao = require('../dao/gameDao');
const eventDao = require('../dao/eventDao');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const net = await loadNetwork();
    const { startId, destId } = assignStartDest(net);
    const id = await gameDao.createGame(req.user.id, startId, destId, new Date().toISOString());
    res.status(201).json({
      id,
      start: { id: startId, name: net.stationName.get(startId) },
      destination: { id: destId, name: net.stationName.get(destId) },
      stations: net.stations, 
      segments: net.segments.map((s) => ({ from: s.from, to: s.to })), 
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/:id/route',
  isLoggedIn,
  param('id').isInt({ min: 1 }),
  body('route').isArray(),
  body('route.*.from').isInt({ min: 1 }),
  body('route.*.to').isInt({ min: 1 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
      const gameId = Number(req.params.id);
      const game = await gameDao.getGame(gameId);
      if (!game) return res.status(404).json({ error: 'Game not found' });
      if (game.user_id !== req.user.id) return res.status(403).json({ error: 'Not your game' });
      if (game.status !== 'pending') return res.status(409).json({ error: 'Game already finished' });

      const net = await loadNetwork();
      const route = req.body.route.map((s) => ({ from: s.from, to: s.to }));
      const check = validateRoute(net, route, game.start_station_id, game.dest_station_id);

      if (!check.valid) {
        await gameDao.finalizeGame(gameId, 0, 'failed');
        return res.json({ valid: false, reason: check.reason, status: 'failed', score: 0, steps: [] });
      }

      const events = await eventDao.getEvents();
      const { steps, score } = simulateRoute(route, events);
      await gameDao.finalizeGame(gameId, score, 'completed');

      const named = steps.map((st) => ({
        from: { id: st.from, name: net.stationName.get(st.from) },
        to: { id: st.to, name: net.stationName.get(st.to) },
        event: st.event,
        coinsAfter: st.coinsAfter,
      }));
      res.json({ valid: true, status: 'completed', score, steps: named });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
