import { Button } from 'react-bootstrap';


export default function SegmentList({ segments, usedKeys, onPick, disabled = false }) {
  return (
    <ul className="lr-seg-list" aria-label="All segments (pairs of connected stations)">
      {segments.map((seg) => {
        const used = usedKeys.has(seg.key);
        return (
          <li key={seg.key} className="lr-seg-item">
            <Button
              type="button"
              variant="outline-primary"
              className="lr-seg-btn"
              disabled={disabled || used}
              onClick={() => onPick(seg)}
            >
              <span className="lr-seg-label">{seg.label}</span>
              {used && <span className="lr-seg-tag">added</span>}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
