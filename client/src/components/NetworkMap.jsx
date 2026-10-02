import MapLine from './MapLine.jsx';
import MapStation from './MapStation.jsx';
import { STATION_LAYOUT, MAP_VIEWBOX } from '../constants.js';


export default function NetworkMap({
  mode,
  stations,
  lines = [],
  interchangeIds = [],
  startId,
  destId,
  currentId,
}) {
  const byId = new Map(stations.map((s) => [s.id, s]));
  const coordOf = ( id) => {
    const st = byId.get(id);
    return st ? STATION_LAYOUT[st.name] : undefined;
  };
  const interchangeSet = new Set(interchangeIds);


  const edges =
    mode === 'setup'
      ? lines.map((line) => {
          const points = line.stations.map((id) => coordOf(id)).filter(Boolean);
          return <MapLine key={`line-${line.id}`} points={points} color={line.color} width={7} />;
        })
      : null;

  const roleOf = ( id) => {
    if (id === startId) return 'start';
    if (id === destId) return 'dest';
    if (id === currentId) return 'current';
    return null;
  };

  return (
    <svg
      className="lr-map"
      viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
      role="img"
      aria-label={mode === 'setup' ? 'Metro network map' : 'Stations only (connections hidden)'}
    >
      {edges && <g>{edges}</g>}
      <g>
        {stations.map((s) => {
          const c = STATION_LAYOUT[s.name];
          if (!c) return null;
          return (
            <MapStation
              key={s.id}
              x={c.x}
              y={c.y}
              name={s.name}
              interchange={mode === 'setup' && interchangeSet.has(s.id)}
              role={roleOf(s.id)}
            />
          );
        })}
      </g>
    </svg>
  );
}
