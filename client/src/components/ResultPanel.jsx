import { Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { REASON_MESSAGES } from '../constants.js';


export default function ResultPanel({ result, onPlayAgain }) {
  const failed = !result.valid;
  const reasonMsg = result.reason ? REASON_MESSAGES[result.reason] : null;
  return (
    <Card className="lr-card text-center">
      <Card.Header>Result</Card.Header>
      <Card.Body>
        <div className="lr-subtle mb-1">Final score</div>
        <div className={`lr-score-big ${result.score === 0 ? 'lr-score-zero' : ''}`}>
          {result.score}
        </div>
        {failed ? (
          <Alert variant="warning" className="mt-3 d-inline-block">
            Route failed{reasonMsg ? `: ${reasonMsg}` : '.'}
          </Alert>
        ) : (
          <p className="mt-3 mb-0">Nice ride! You finished with {result.score} coins.</p>
        )}
        <div className="d-flex gap-2 justify-content-center mt-4 flex-wrap">
          <Button onClick={onPlayAgain}>Play again</Button>
          <Link className="btn btn-outline-primary" to="/ranking">
            View ranking
          </Link>
          <Link className="btn btn-outline-secondary" to="/">
            Back to setup
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}
