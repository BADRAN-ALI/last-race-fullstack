import { useEffect, useState } from 'react';
import { Card, Alert } from 'react-bootstrap';
import * as API from '../API.js';
import { useAuth } from '../contexts/AuthContext.js';
import RankingTable from '../components/RankingTable.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';


export default function RankingPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState( (null));
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    API.getRanking()
      .then((r) => { if (active) setRows(r); })
      .catch((err) => { if (active) setError(err.message || 'Could not load the ranking.'); });
    return () => { active = false; };
  }, []);

  return (
    <Card className="lr-card">
      <Card.Header>Ranking — best score per player</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {!rows && !error && <LoadingSpinner label="Loading ranking…" />}
        {rows && <RankingTable rows={rows} meUsername={user?.username} />}
      </Card.Body>
    </Card>
  );
}
