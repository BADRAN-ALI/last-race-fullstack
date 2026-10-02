import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';



export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const from = (location.state && location.state.from) || '/';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setValidated(true);
      return;
    }
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
      setSubmitting(false);
    }
  }

  return (
    <div className="lr-login">
      <div className="lr-login-head">
        <span className="lr-brand-token lr-brand-token-lg" aria-hidden="true" />
        <h1 className="lr-section-title">Last Race</h1>
        <p className="lr-subtle mb-0">Log in to plan routes and climb the ranking.</p>
      </div>
      <Card className="lr-card">
        <Card.Header>Log in</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                isInvalid={validated && !username.trim()}
                autoFocus
                autoComplete="username"
              />
              <Form.Control.Feedback type="invalid">Enter your username.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={validated && !password}
                autoComplete="current-password"
              />
              <Form.Control.Feedback type="invalid">Enter your password.</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" disabled={submitting} className="w-100">
              {submitting ? 'Logging in…' : 'Log in'}
            </Button>
          </Form>
          <p className="mt-3 mb-0 lr-subtle">
            <Link to="/">← Back to instructions</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
