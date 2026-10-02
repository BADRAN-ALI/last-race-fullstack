import { Button } from 'react-bootstrap';


export default function RouteTimeline({ steps, onUndo, onReset, startName, disabled = false }) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Your route</strong>
        <span>
          <Button
            size="sm"
            variant="outline-secondary"
            className="me-2"
            onClick={onUndo}
            disabled={disabled || steps.length === 0}
          >
            Undo
          </Button>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={onReset}
            disabled={disabled || steps.length === 0}
          >
            Clear
          </Button>
        </span>
      </div>
      {steps.length === 0 ? (
        <p className="lr-subtle mb-0">
          Start at <strong>{startName}</strong> and pick a connection.
        </p>
      ) : (
        <div className="d-flex flex-column gap-2">
          {steps.map((s, i) => (
            <div key={`${s.from.id}-${s.to.id}-${i}`} className="lr-route-step">
              <span className="lr-route-num">{i + 1}</span>
              <span>
                {s.from.name} → <strong>{s.to.name}</strong>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
