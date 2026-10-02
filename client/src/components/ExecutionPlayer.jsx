import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { START_COINS } from '../constants.js';


export default function ExecutionPlayer({ steps, start, onFinish }) {
  const [revealed, setRevealed] = useState(0);
  const coins = revealed === 0 ? START_COINS : steps[revealed - 1].coinsAfter;
  const allRevealed = revealed >= steps.length;

  return (
    <Card className="lr-card">
      <Card.Header>The ride</Card.Header>
      <Card.Body>
        <div className="text-center mb-4">
          <div className="lr-subtle">Coins</div>
          <div className="lr-coins">🪙 {coins}</div>
        </div>

        <div className="d-flex flex-column gap-2 mb-4">
          <div className="lr-route-step">
            <span className="lr-route-num">•</span>
            <span>
              Board at <strong>{start.name}</strong> with {START_COINS} coins.
            </span>
          </div>
          {steps.slice(0, revealed).map((st, i) => (
            <div key={i} className="lr-route-step">
              <span className="lr-route-num">{i + 1}</span>
              <span className="flex-grow-1">
                {st.from.name} → <strong>{st.to.name}</strong>: {st.event.description}{' '}
                <EffectBadge effect={st.event.effect} /> → 🪙 {st.coinsAfter}
              </span>
            </div>
          ))}
        </div>

        <div className="d-grid">
          {!allRevealed ? (
            <Button onClick={() => setRevealed((n) => n + 1)}>Reveal next stop</Button>
          ) : (
            <Button variant="success" onClick={onFinish}>
              See final score
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}


function EffectBadge({ effect }) {
  if (effect > 0) return <span className="lr-effect-pos">+{effect}</span>;
  if (effect < 0) return <span className="lr-effect-neg">{effect}</span>;
  return <span className="lr-effect-zero">±0</span>;
}
