

export default function MapLine({ points, color, width = 7, opacity = 1 }) {
  const coords = points.map((p) => `${p.x},${p.y}`).join(' ');
  return (
    <polyline
      points={coords}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeOpacity={opacity}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
