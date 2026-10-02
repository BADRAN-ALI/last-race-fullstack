



export const PLANNING_SECONDS = 90;
export const START_COINS = 20;



export const STATION_LAYOUT = {
  Vetro: { x: 90, y: 120 },
  Centrale: { x: 280, y: 120 },
  Fucina: { x: 470, y: 120 },
  Foro: { x: 650, y: 120 },
  Torre: { x: 860, y: 120 },
  Lido: { x: 110, y: 270 },
  Mercato: { x: 400, y: 270 },
  Aurora: { x: 510, y: 380 },
  Nord: { x: 680, y: 450 },
  Boschetto: { x: 540, y: 35 },
  Giardino: { x: 740, y: 290 },
  Miralago: { x: 780, y: 450 },
  Cala: { x: 900, y: 540 },
  Faro: { x: 350, y: 490 },
  Pineta: { x: 640, y: 520 },
  Molo: { x: 920, y: 380 },
};

export const MAP_VIEWBOX = { width: 1000, height: 580 };


export const REASON_MESSAGES = {
  empty: 'No route was submitted — the timer ran out or nothing was built.',
  'wrong-start': 'The route did not begin at the assigned start station.',
  'wrong-end': 'The route never reached the destination.',
  'not-connected': 'The chosen segments do not form a connected path.',
  'no-such-segment': 'One of the segments is not a real connection.',
  'segment-reused': 'The same segment was used more than once.',
  'illegal-line-change': 'A line was changed somewhere other than an interchange.',
};


export const segKey = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
