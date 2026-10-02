import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { useTheme } from '../contexts/ThemeContext.js';



export default function NavHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <Navbar expand="lg" className="lr-navbar">
      <Container className="lr-main">
        <Navbar.Brand as={Link} to="/" className="lr-brand">
          <span className="lr-brand-token" aria-hidden="true" />
          <span className="lr-brand-word">Last Race</span>
        </Navbar.Brand>
        <Nav className="me-auto lr-nav">
          <Nav.Link as={NavLink} to="/" end>
            Setup
          </Nav.Link>
          {user && (
            <Nav.Link as={NavLink} to="/ranking">
              Ranking
            </Nav.Link>
          )}
        </Nav>
        <Nav className="align-items-lg-center lr-nav-right">
          <ThemeToggle />
          {user ? (
            <>
              <span className="lr-greeting">
                Hi, <strong>{user.name}</strong>
              </span>
              <Button size="sm" className="lr-btn-ghost" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <Nav.Link as={NavLink} to="/login">
              Log in
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}


function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className="lr-theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <rect
              key={deg}
              x="11.1"
              y="1.4"
              width="1.8"
              height="3.6"
              rx="0.9"
              fill="currentColor"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
