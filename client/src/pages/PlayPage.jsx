import { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import * as API from '../API.js';
import PlanningBoard from '../components/PlanningBoard.jsx';
import ExecutionPlayer from '../components/ExecutionPlayer.jsx';
import ResultPanel from '../components/ResultPanel.jsx';





export default function PlayPage() {
  const location = useLocation();

  const initialGame = location.state && location.state.game;
  const [game, setGame] = useState( (initialGame || null));
  const [phase, setPhase] = useState('planning');
  const [result, setResult] = useState( (null));
  const [error, setError] = useState('');

  if (!game) return <Navigate to="/" replace />;
  const activeGame = game;


  async function handleSubmit(route) {
    setError('');
    try {
      const res = await API.submitRoute(activeGame.id, route);
      setResult(res);
      setPhase(res.valid ? 'execution' : 'result');
    } catch (err) {
      setError(err.message || 'Could not submit the route.');
      setResult({ valid: false, status: 'failed', score: 0, steps: [], reason: 'empty' });
      setPhase('result');
    }
  }

  async function handlePlayAgain() {
    setError('');
    try {
      const next = await API.createGame();
      setResult(null);
      setGame(next);
      setPhase('planning');
    } catch (err) {
      setError(err.message || 'Could not start a new game.');
    }
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {phase === 'planning' && <PlanningBoard key={game.id} game={game} onSubmit={handleSubmit} />}
      {phase === 'execution' && result && (
        <div className="lr-narrow">
          <ExecutionPlayer
            steps={result.steps}
            start={game.start}
            onFinish={() => setPhase('result')}
          />
        </div>
      )}
      {phase === 'result' && result && (
        <div className="lr-narrow">
          <ResultPanel result={result} onPlayAgain={handlePlayAgain} />
        </div>
      )}
    </>
  );
}
