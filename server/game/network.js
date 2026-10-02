'use strict';

const networkDao = require('../dao/networkDao');

let cache = null;

function segKey(a, b) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

async function loadNetwork() {
  if (cache) return cache;

  const [stations, lines, lineStations] = await Promise.all([
    networkDao.getStations(),
    networkDao.getLines(),
    networkDao.getLineStations(),
  ]);

  const lineMap = new Map(lines.map((l) => [l.id, { id: l.id, name: l.name, color: l.color, stations: [] }]));
  for (const ls of lineStations) lineMap.get(ls.line_id).stations.push(ls.station_id);

  const adjacency = new Map(stations.map((s) => [s.id, new Set()])); 
  const segmentLines = new Map(); 
  const stationLines = new Map(stations.map((s) => [s.id, new Set()])); 

  for (const line of lineMap.values()) {
    for (let i = 0; i < line.stations.length; i++) {
      const sid = line.stations[i];
      stationLines.get(sid).add(line.id);
      if (i > 0) {
        const a = line.stations[i - 1];
        const b = line.stations[i];
        adjacency.get(a).add(b);
        adjacency.get(b).add(a);
        const key = segKey(a, b);
        if (!segmentLines.has(key)) segmentLines.set(key, new Set());
        segmentLines.get(key).add(line.id);
      }
    }
  }

  const interchanges = new Set();
  for (const [sid, ls] of stationLines) if (ls.size > 1) interchanges.add(sid);

  const segments = [];
  for (const [key, lineSet] of segmentLines) {
    const [a, b] = key.split('-').map(Number);
    segments.push({ from: a, to: b, lines: [...lineSet] });
  }

  cache = {
    stations,
    lines: [...lineMap.values()],
    adjacency,
    segmentLines,
    stationLines,
    interchanges,
    segments,
    stationName: new Map(stations.map((s) => [s.id, s.name])),
  };
  return cache;
}

function linesForSegment(net, a, b) {
  return net.segmentLines.get(segKey(a, b)) || new Set();
}

function isInterchange(net, stationId) {
  return net.interchanges.has(stationId);
}

function bfsDistances(net, sourceId) {
  const dist = new Map([[sourceId, 0]]);
  const queue = [sourceId];
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    for (const nb of net.adjacency.get(cur)) {
      if (!dist.has(nb)) {
        dist.set(nb, dist.get(cur) + 1);
        queue.push(nb);
      }
    }
  }
  return dist;
}

function clearCache() {
  cache = null;
}

module.exports = { loadNetwork, linesForSegment, isInterchange, bfsDistances, segKey, clearCache };
