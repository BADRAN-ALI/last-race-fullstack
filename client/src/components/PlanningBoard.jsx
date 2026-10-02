import { useMemo, useRef, useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { PLANNING_SECONDS, segKey } from '../constants.js';
import { useCountdown } from '../hooks/useCountdown.js';
import NetworkMap from './NetworkMap.jsx';
import CountdownTimer from './CountdownTimer.jsx';
import SegmentList from './SegmentList.jsx';
import RouteTimeline from './RouteTimeline.jsx';


export default function PlanningBoard({ game, onSubmit }) {
  const [route, setRoute] = useState( ([]));
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  const stationById = useMemo(() => new Map(game.stations.map((s) => [s.id, s])), [game]);
  const nameOf = ( id) => stationById.get(id)?.name ?? `#${id}`;



  const allSegments = useMemo(() => {
    const name = ( id) => stationById.get(id)?.name ?? `#${id}`;
    return game.segments
      .map((s) => {
        const a = name(s.from);
        const b = name(s.to);
        const [n1, n2] = a <= b ? [a, b] : [b, a];
        return { from: s.from, to: s.to, key: segKey(s.from, s.to), label: `${n1} — ${n2}` };
      })
      .sort((x, y) => x.label.localeCompare(y.label));
  }, [game, stationById]);

  const usedKeys = useMemo(() => new Set(route.map((r) => segKey(r.from, r.to))), [route]);
  const currentId = route.length ? route[route.length - 1].to : game.start.id;

  const displaySteps = route.map((r) => ({
    from: stationById.get(r.from) || { id: r.from, name: nameOf(r.from) },
    to: stationById.get(r.to) || { id: r.to, name: nameOf(r.to) },
  }));


  function pick( seg) {
    setRoute((prev) => {
      const at = prev.length ? prev[prev.length - 1].to : game.start.id;
      const step = at === seg.to ? { from: seg.to, to: seg.from } : { from: seg.from, to: seg.to };
      return prev.concat(step);
    });
  }
  function undo() {
    setRoute((prev) => prev.slice(0, -1));
  }
  function reset() {
    setRoute([]);
  }

  function doSubmit( currentRoute) {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    onSubmit(currentRoute);
  }

  const remaining = useCountdown(PLANNING_SECONDS, () => doSubmit(route), true);

  return (
    <Row className="g-4">
      <Col lg={7}>
        <Card className="lr-card">
          <Card.Header>Stations — connections hidden</Card.Header>
          <Card.Body>
            <NetworkMap
              mode="planning"
              stations={game.stations}
              startId={game.start.id}
              destId={game.destination.id}
              currentId={currentId}
            />
          </Card.Body>
        </Card>
      </Col>

      <Col lg={5}>
        <Card className="lr-card mb-3">
          <Card.Body>
            <div className="lr-od mb-3">
              <span className="badge text-bg-success">Start: {game.start.name}</span>
              <span>→</span>
              <span className="badge text-bg-danger">Destination: {game.destination.name}</span>
            </div>
            <CountdownTimer remaining={remaining} total={PLANNING_SECONDS} />
          </Card.Body>
        </Card>

        <Card className="lr-card mb-3">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <span>All segments</span>
              <span className="lr-subtle">
                Currently at <strong>{nameOf(currentId)}</strong>
              </span>
            </div>
          </Card.Header>
          <Card.Body>
            <SegmentList
              segments={allSegments}
              usedKeys={usedKeys}
              onPick={pick}
              disabled={submitting}
            />
          </Card.Body>
        </Card>

        <Card className="lr-card mb-3">
          <Card.Body>
            <RouteTimeline
              steps={displaySteps}
              onUndo={undo}
              onReset={reset}
              startName={game.start.name}
              disabled={submitting}
            />
          </Card.Body>
        </Card>

        <div className="d-grid">
          <Button
            size="lg"
            onClick={() => doSubmit(route)}
            disabled={submitting || route.length === 0}
          >
            {submitting ? 'Submitting…' : 'Submit route'}
          </Button>
        </div>
      </Col>
    </Row>
  );
}
