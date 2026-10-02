'use strict';

const { bfsDistances } = require('./network');

const START_COINS = 20;
const MIN_DISTANCE = 3; 

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function assignStartDest(net) {
  const ids = net.stations.map((s) => s.id);
  const starts = [...ids].sort(() => Math.random() - 0.5);
  for (const start of starts) {
    const dist = bfsDistances(net, start);
    const candidates = [...dist.entries()].filter(([, d]) => d >= MIN_DISTANCE).map(([id]) => id);
    if (candidates.length > 0) {
      return { startId: start, destId: randomItem(candidates) };
    }
  }
  throw new Error('No start/destination pair is at least MIN_DISTANCE apart');
}

function simulateRoute(route, events) {
  let coins = START_COINS;
  const steps = [];
  for (const seg of route) {
    const event = randomItem(events);
    coins += event.effect;
    steps.push({
      from: seg.from,
      to: seg.to,
      event: { description: event.description, effect: event.effect },
      coinsAfter: coins,
    });
  }
  return { steps, score: Math.max(0, coins) };
}

module.exports = { assignStartDest, simulateRoute, START_COINS, MIN_DISTANCE };
