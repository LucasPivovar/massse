import React from 'react';
import { NavLink } from 'react-router-dom';
import logoImage from '../assets/image.png';

/* ── Brand Logo ─────────────────────────────────────────────────────────── */
const Logo = ({ size = 36 }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: Math.round(size * 0.28) + 'px',
    background: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 18px rgba(168, 85, 247,0.35)',
    flexShrink: 0,
  }}>
    <span style={{
      color: '#000',
      fontSize: Math.round(size * 0.5) + 'px',
      fontWeight: '900',
      fontFamily: 'Outfit, sans-serif',
      lineHeight: 1,
      letterSpacing: '-0.05em',
    }}>M</span>
  </div>
);

/* ── Nav Icons ──────────────────────────────────────────────────────────── */
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
  Reports: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  ClientDashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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
  Financial: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
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
};

/* ── Sidebar ────────────────────────────────────────────────────────────── */
const Sidebar = ({ onLogout, isOpen, setIsOpen }) => {
  const menuItems = [
    { path: '/',          label: 'Visão Geral', icon: <Icons.Dashboard /> },
    { path: '/contacts',  label: 'Contatos',    icon: <Icons.Contacts /> },
    { path: '/campaigns', label: 'Campanhas',   icon: <Icons.Campaigns /> },
    { path: '/chat',      label: 'Bate-papo',   icon: <Icons.Chat /> },
    { path: '/bot-builder', label: 'Criador de Bots', icon: <Icons.Bot /> },
  ];

  return (
    <aside className={`sidebar-container ${isOpen ? 'open' : ''}`} style={styles.sidebar}>
      {/* Brand header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '14px' }}>
            <img src={logoImage} alt="Logo" style={{ height: '20px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Navigation */}
      <div style={styles.scrollArea}>
        <div style={styles.section}>
          <div style={styles.sectionLabel}>MENU</div>
          <nav style={styles.nav}>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  ...styles.link,
                  ...(isActive ? styles.activeLink : {}),
                })}
              >
                {({ isActive }) => (
                  <>
                    {/* Active left bar */}
                    <div style={{
                      ...styles.activeBar,
                      opacity: isActive ? 1 : 0,
                      background: 'var(--accent-primary)',
                    }} />
                    <span style={{
                      ...styles.icon,
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    }}>
                      {item.icon}
                    </span>
                    <span style={{
                      ...styles.label,
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: isActive ? '600' : '500',
                    }}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>CONFIGURAÇÕES</div>
          <nav style={styles.nav}>
            <NavLink
              to="/settings"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.activeLink : {}),
              })}
            >
              {({ isActive }) => (
                <>
                  <div style={{
                    ...styles.activeBar,
                    opacity: isActive ? 1 : 0,
                    background: 'var(--accent-primary)',
                  }} />
                  <span style={{
                    ...styles.icon,
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  }}>
                    <Icons.Settings />
                  </span>
                  <span style={{
                    ...styles.label,
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? '600' : '500',
                  }}>
                    Configurações
                  </span>
                </>
              )}
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: '0 1.5rem 1.5rem', marginTop: 'auto' }}>
        <button onClick={onLogout} className="btn-logout" style={{ width: '100%', padding: '0.8rem 1rem' }}>
          <Icons.Logout />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    height: '100vh',
    backgroundColor: '#ffffff',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRight: '1px solid var(--border-glass)',
    borderRadius: 0,
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    overflow: 'hidden',
  },
  header: {
    padding: '1.75rem 1.5rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    color: '#E5E5E5',
    fontSize: '1.25rem',
    fontWeight: '800',
    letterSpacing: '-0.03em',
    fontFamily: 'Outfit, sans-serif',
  },
  divider: {
    height: '1px',
    background: 'rgba(168, 85, 247,0.07)',
    margin: '0 1.5rem',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem 0',
  },
  section: {
    marginBottom: '1.75rem',
  },
  sectionLabel: {
    padding: '0 1.75rem',
    fontSize: '0.65rem',
    fontWeight: '700',
    color: 'rgba(107,114,128,0.7)',
    letterSpacing: '0.1em',
    marginBottom: '0.5rem',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.7rem 1.75rem',
    textDecoration: 'none',
    position: 'relative',
    transition: 'background 0.18s ease',
    gap: '0',
  },
  activeLink: {
    backgroundColor: 'rgba(168, 85, 247,0.06)',
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: '18%',
    height: '64%',
    width: '3px',
    borderTopRightRadius: '3px',
    borderBottomRightRadius: '3px',
    transition: 'opacity 0.18s ease',
    boxShadow: '0 0 8px rgba(168, 85, 247,0.6)',
  },
  icon: {
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.18s ease',
    flexShrink: 0,
  },
  label: {
    fontSize: '0.875rem',
    transition: 'color 0.18s ease, font-weight 0.18s ease',
  },
  closeBtn: {
    background: 'rgba(0,0,0,0.04)',
    border: '1px solid var(--border-glass)',
    color: 'var(--text-secondary)',
    padding: '5px 8px',
    boxShadow: 'none',
    borderRadius: '7px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.18s',
    minWidth: 'auto',
    margin: 0,
  },
};

export default Sidebar;
