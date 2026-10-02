import { ProgressBar } from 'react-bootstrap';



export default function CountdownTimer({ remaining, total }) {
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  const low = remaining <= 15;
  const variant = remaining <= 10 ? 'danger' : remaining <= 30 ? 'warning' : 'info';
  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, '0');
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="lr-subtle">Time left</span>
        <span className={`lr-timer-num ${low ? 'lr-timer-low' : ''}`}>
          {mm}:{ss}
        </span>
      </div>
      <ProgressBar now={pct} variant={variant} />
    </div>
  );
}
