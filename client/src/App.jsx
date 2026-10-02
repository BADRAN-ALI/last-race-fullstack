import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useAuth } from './contexts/AuthContext.js';
import NavHeader from './components/NavHeader.jsx';
import RequireAuth from './components/ProtectedRoute.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SetupPage from './pages/SetupPage.jsx';
import PlayPage from './pages/PlayPage.jsx';
import RankingPage from './pages/RankingPage.jsx';

export default function App() {
  const { loading } = useAuth();

  if (loading) return <LoadingSpinner full label="Starting Last Race…" />;

  return (
    <>
      <NavHeader />
      <Container className="py-4 lr-main">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<SetupPage />} />
          <Route path="/play" element={<RequireAuth><PlayPage /></RequireAuth>} />
          <Route path="/ranking" element={<RequireAuth><RankingPage /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}
