
const BASE = 'http://localhost:3001/api';

async function parse(res) {
  if (res.status === 204) return null;
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body && body.error) message = body.error;
      else if (body && Array.isArray(body.errors)) message = 'Invalid input.';
    } catch {
      message = `HTTP ${res.status}`;
    }
    const err = new Error(message);
    (err).status = res.status;
    throw err;
  }
  return res.json();
}

async function request(path, opts = {}) {
  const { method = 'GET', body } = opts;
  const res = await fetch(BASE + path, {
    method,
    credentials: 'include',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return parse(res);
}

export function login(username, password) {
  return request('/sessions', { method: 'POST', body: { username, password } });
}
export function getCurrentSession() {
  return request('/sessions/current');
}
export function logout() {
  return request('/sessions/current', { method: 'DELETE' });
}

export function getNetwork() {
  return request('/network');
}
export function createGame() {
  return request('/games', { method: 'POST' });
}
export function submitRoute(gameId, route) {
  return request(`/games/${gameId}/route`, { method: 'POST', body: { route } });
}
export function getRanking() {
  return request('/ranking');
}
