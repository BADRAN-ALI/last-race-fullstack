import { Card } from 'react-bootstrap';


export default function Instructions() {
  return (
    <Card className="lr-card mb-4">
      <Card.Header>How to play</Card.Header>
      <Card.Body>
        <p className="mb-2">
          <strong>Last Race</strong> is a single-player metro-routing game. You are given a random{' '}
          <strong>start</strong> and <strong>destination</strong> station, at least three stops apart.
        </p>
        <ol className="mb-2">
          <li>
            <strong>Plan (90 seconds).</strong> The map shows the stations and their names — but{' '}
            <em>not</em> the connections between them. A separate <strong>list of every segment</strong>{' '}
            (a pair of connected stations) is given. Rebuild the network in your head and assemble a
            route from start to destination by selecting segments in sequence — each segment only once.
          </li>
          <li>
            <strong>Execute.</strong> Your route is checked, then ridden stop by stop. Each hop triggers
            a random event that adds or removes coins. You start with <strong>20 coins</strong>.
          </li>
          <li>
            <strong>Result.</strong> Your remaining coins are your score (never below 0). An invalid or
            unfinished route scores 0.
          </li>
        </ol>
        <p className="mb-0 lr-subtle">
          When the 90 seconds run out, whatever you have built so far is submitted automatically.
        </p>
      </Card.Body>
    </Card>
  );
}
