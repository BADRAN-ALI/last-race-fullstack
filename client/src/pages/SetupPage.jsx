import { useEffect, useState } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import * as API from '../API.js';
import Instructions from '../components/Instructions.jsx';
import NetworkMap from '../components/NetworkMap.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';



export default function SetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [network, setNetwork] = useState( (null));
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {



    if (!user) return undefined;
    let active = true;
    API.getNetwork()
      .then((n) => { if (active) { setNetwork(n); setError(''); } })
      .catch((err) => { if (active) setError(err.message || 'Could not load the network.'); });
    return () => { active = false; };
  }, [user]);

  async function handleStart() {
    setError('');
    setStarting(true);
    try {
      const game = await API.createGame();
      navigate('/play', { state: { game } });
    } catch (err) {
      setError(err.message || 'Could not start a game.');
      setStarting(false);
    }
  }

  return (
    <>
      <div className="lr-hero">
        <div>
          <p className="lr-hero-kicker">Metro routing · single player</p>
          <h1 className="lr-section-title">Last Race</h1>
        </div>
        <p className="lr-hero-sub">
          Rebuild the network from the list of segments and race a valid route to the destination
          before the 90&nbsp;seconds run out.
        </p>
      </div>
      <Instructions />

      {!user && (
        <Alert variant="info">
          Log in to see the network map and play. Anonymous visitors can read the instructions only.
        </Alert>
      )}

      {user && (
        <Card className="lr-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>The network</span>
            <Button onClick={handleStart} disabled={starting || !network}>
              {starting ? 'Starting…' : 'Start a new game'}
            </Button>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {!network && !error && <LoadingSpinner label="Loading the map…" />}
            {network && (
              <>
                <div className="lr-legend mb-3">
                  {network.lines.map((l) => (
                    <span key={l.id} className="lr-line-chip">
                      <span className="lr-line-swatch" style={{ background: l.color }} />
                      {l.name}
                    </span>
                  ))}
                  <span className="lr-line-chip">
                    <span className="lr-line-swatch" style={{ background: 'var(--lr-ink)' }} />
                    interchange (2+ lines)
                  </span>
                </div>
                <NetworkMap
                  mode="setup"
                  stations={network.stations}
                  lines={network.lines}
                  interchangeIds={network.interchanges}
                />
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  );
}
