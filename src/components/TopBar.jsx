import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo_massflow.png';

const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/>
      <rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
    </svg>
  ),
  Contacts: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Campaigns: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
    </svg>
  ),
  Chat: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Bot: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/>
      <line x1="8" y1="16" x2="8" y2="16"/>
      <line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  ),
  Reports: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Financeiro: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Planos: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
};

const TopBar = ({ onLogout, onOpenChat, onCloseChat }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedExpert = localStorage.getItem('selectedExpert') || 'Usuário';
  const expertInitial = selectedExpert.charAt(0).toUpperCase();

  // Se a rota for raiz, estamos no Hub e não mostramos os menus de Sender.
  const isHubPage = location.pathname === '/';

  const menuItems = [
    { path: '/sender/dashboard', label: 'Visão Geral', icon: <Icons.Dashboard /> },
    { path: '/contacts',         label: 'Contatos',    icon: <Icons.Contacts /> },
    { path: '/campaigns',        label: 'Campanhas',   icon: <Icons.Campaigns /> },
    { path: '/bot-builder',      label: 'Meus Fluxos', icon: <Icons.Bot /> },
    { path: '/reports',          label: 'Relatórios',  icon: <Icons.Reports /> },
  ];

  return (
    <>
      <header className="topbar-container" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: 'none',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {/* Logo */}
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => {
            if (onCloseChat) onCloseChat();
            navigate('/');
          }}>
            <img src={logoImage} alt="MassFlow Logo" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>

        {/* Desktop Nav - Centered */}
        {!isHubPage && (
          <nav className="topbar-nav desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', height: '100%', justifyContent: 'center' }}>
            {menuItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `topbar-link ${isActive ? 'active' : ''}`}
              >
                {({ isActive }) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                    <span className="topbar-icon" style={{ display: 'flex', alignItems: 'center', color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                      {item.icon}
                    </span>
                    <span className="topbar-label" style={{ fontSize: '0.88rem', color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: isActive ? '600' : '500' }}>
                      {item.label}
                    </span>
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'flex-end' }}>
          
          {!isHubPage && (
            <button onClick={onOpenChat} className="topbar-chat-btn" style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-sm)' }} title="Abrir Chat">
              <Icons.Chat />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }} className="desktop-only">Chat</span>
            </button>
          )}

          {/* Profile Dropdown (Desktop Only) */}
          <div className="profile-dropdown-container desktop-only" style={{ position: 'relative' }}>
            <button 
              onClick={() => {
                const el = document.getElementById('profile-menu');
                if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block';
              }} 
              style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-primary)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', boxShadow: 'none' }} title="Perfil">
              <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{expertInitial}</span>
            </button>

            {/* Dropdown Menu */}
            <div id="profile-menu" style={{ display: 'none', position: 'absolute', top: '100%', right: '0', marginTop: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px', boxShadow: 'var(--shadow-md)', minWidth: '180px', overflow: 'hidden', zIndex: 100 }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{selectedExpert}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>admin@massflow.com</span>
              </div>
              <button onClick={() => { navigate('/planos'); document.getElementById('profile-menu').style.display='none'; }} style={{ width: '100%', padding: '0.75rem 1rem', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', boxShadow: 'none', borderRadius: 0 }} onMouseOver={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}>
                <Icons.Planos />
                Planos
              </button>
              <button onClick={() => { navigate('/settings'); document.getElementById('profile-menu').style.display='none'; }} style={{ width: '100%', padding: '0.75rem 1rem', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', boxShadow: 'none', borderRadius: 0 }} onMouseOver={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}>
                <Icons.Settings />
                Configurações
              </button>
              <button onClick={onLogout} style={{ width: '100%', padding: '0.75rem 1rem', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.85rem', boxShadow: 'none', borderRadius: 0 }} onMouseOver={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}>
                <Icons.Logout />
                Sair
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-only menu-toggle-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'none', padding: '8px', boxShadow: 'none', borderRadius: 0 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-backdrop" onClick={() => setMenuOpen(false)} />
        <div className="drawer-content">
          <nav style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '0.5rem', height: '100%' }}>
            <div style={{ marginBottom: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
              <img src={logoImage} alt="MassFlow Logo" style={{ height: '36px' }} />
            </div>
            {!isHubPage && menuItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <span style={{ marginRight: '12px' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            <div style={{ flex: 1 }}></div>
            <hr style={{ borderColor: 'var(--border-glass)', margin: '1rem 0' }} />
            <button onClick={() => { navigate('/planos'); setMenuOpen(false); }} className="mobile-drawer-link" style={{ color: 'var(--text-primary)', background: 'transparent', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '8px', boxShadow: 'none', borderRadius: 0 }}>
              <span style={{ marginRight: '12px' }}><Icons.Planos /></span>
              Planos
            </button>
            <button onClick={() => { navigate('/settings'); setMenuOpen(false); }} className="mobile-drawer-link" style={{ color: 'var(--text-primary)', background: 'transparent', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '8px', boxShadow: 'none', borderRadius: 0 }}>
              <span style={{ marginRight: '12px' }}><Icons.Settings /></span>
              Configurações
            </button>
            <button onClick={() => { onLogout(); setMenuOpen(false); }} className="mobile-drawer-link" style={{ color: '#ef4444', background: 'transparent', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: 'none', borderRadius: 0 }}>
              <span style={{ marginRight: '12px' }}><Icons.Logout /></span>
              Sair
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default TopBar;
