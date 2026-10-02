'use strict';


const { linesForSegment, isInterchange, segKey } = require('./network');

function validateRoute(net, route, startId, destId) {
  if (!Array.isArray(route) || route.length === 0) return { valid: false, reason: 'empty' };

  if (route[0].from !== startId) return { valid: false, reason: 'wrong-start' };
  if (route[route.length - 1].to !== destId) return { valid: false, reason: 'wrong-end' };

  const used = new Set();
  let prevLines = null;

  for (let i = 0; i < route.length; i++) {
    const seg = route[i];

    if (i > 0 && seg.from !== route[i - 1].to) return { valid: false, reason: 'not-connected' };

    const segLines = linesForSegment(net, seg.from, seg.to);
    if (segLines.size === 0) return { valid: false, reason: 'no-such-segment' };

    const key = segKey(seg.from, seg.to);
    if (used.has(key)) return { valid: false, reason: 'segment-reused' };
    used.add(key);

    if (i > 0) {
      let sharesLine = false;
      for (const l of segLines) {
        if (prevLines.has(l)) { sharesLine = true; break; }
      }
      if (!sharesLine && !isInterchange(net, seg.from)) {
        return { valid: false, reason: 'illegal-line-change' };
      }
    }
    prevLines = segLines;
  }

  return { valid: true };
}

module.exports = { validateRoute };
