


export default function MapStation({ x, y, name, interchange = false, role = null, labelDy = 22 }) {
  const r = interchange ? 11 : 8;
  let cls = interchange ? 'lr-map-interchange' : 'lr-map-station';
  if (role === 'start') cls = 'lr-map-start';
  else if (role === 'dest') cls = 'lr-map-dest';
  else if (role === 'current') cls = 'lr-map-current';

  return (
    <g>
      <circle cx={x} cy={y} r={r} className={cls} />
      {interchange && !role && <circle cx={x} cy={y} r={3.5} className="lr-map-interchange-dot" />}
      <text x={x} y={y + labelDy} textAnchor="middle" className="lr-map-label">
        {name}
      </text>
    </g>
  );
}
