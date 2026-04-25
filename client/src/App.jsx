import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Chat from './pages/Chat';
import { AuthProvider, useAuth } from './services/auth.jsx';
import Navbar from './components/Navbar';
import ProfileSetup from './components/ProfileSetup.jsx';

function AppRoutes() {
  const { user, needsProfile, completeProfile } = useAuth();
  return (
    <>
      {user && needsProfile && <ProfileSetup uid={user.uid} onComplete={completeProfile} />}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-ivory via-white to-sage/30 text-charcoal">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
