import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import NewCampaign from './pages/NewCampaign';
import Campaigns from './pages/Campaigns';
import Chat from './pages/Chat';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Register from './pages/Register';
import Financeiro from './pages/Financeiro';
import Planos from './pages/Planos';
import ClientDashboard from './pages/ClientDashboard';
import BotBuilder from './pages/BotBuilder';
import BotCreateFlow from './pages/BotCreateFlow';
import BotFlowDetail from './pages/BotFlowDetail';
import BotFlowEditor from './pages/BotFlowEditor';
import ConnectionsHub from './pages/ConnectionsHub';
import TopBar from './components/TopBar';
import { Toaster } from 'react-hot-toast';
import logoImage from './assets/logo_massflow.png';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const hasDisparos = window.location.pathname.startsWith('/disparos');
  const routerBasename = hasDisparos ? '/disparos' : undefined;

  return (
    <Router basename={routerBasename}>
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          style: { 
            background: 'rgba(10, 16, 6, 0.95)', 
            color: '#E5E5E5', 
            border: '1px solid rgba(168, 85, 247, 0.2)',
            backdropFilter: 'blur(10px)'
          },
          success: { iconTheme: { primary: '#A855F7', secondary: '#000' } },
        }} 
      />
      {!token ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>
          <TopBar onLogout={handleLogout} onOpenChat={() => setIsChatOpen(true)} onCloseChat={() => setIsChatOpen(false)} />

          <div className="app-container" style={{ flex: 1 }}>
            <main className="main-content">
              <Routes>
                <Route path="/" element={<ConnectionsHub />} />
                <Route path="/sender/dashboard" element={<Dashboard token={token} />} />
                <Route path="/contacts" element={<Contacts token={token} />} />
                <Route path="/campaigns" element={<Campaigns token={token} />} />
                <Route path="/bot-builder" element={<BotBuilder />} />
                <Route path="/bot-builder/new" element={<BotCreateFlow />} />
                <Route path="/bot-builder/:id/edit" element={<BotFlowEditor />} />
                <Route path="/bot-builder/:id" element={<BotFlowEditor />} />
                <Route path="/new-campaign" element={<NewCampaign token={token} />} />
                <Route path="/client-dashboard" element={<ClientDashboard token={token} />} />
                <Route path="/reports" element={<Reports token={token} />} />
                <Route path="/settings" element={<Settings token={token} theme={theme} setTheme={setTheme} />} />
                <Route path="/planos" element={<Planos />} />
                <Route path="/financial" element={<Financeiro token={token} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
          {isChatOpen && 
            window.location.pathname !== '/' && 
            window.location.pathname !== '/disparos' && 
            window.location.pathname !== '/disparos/' && (
              <Chat token={token} onClose={() => setIsChatOpen(false)} />
            )
          }
        </div>
      )}
    </Router>
  );
}

export default App;
