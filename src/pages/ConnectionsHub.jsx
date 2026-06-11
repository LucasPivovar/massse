import React from 'react';
import { useNavigate } from 'react-router-dom';

const B = {
  lime: 'var(--accent-primary)',
  text: 'var(--text-primary)',
  muted: 'var(--text-secondary)',
  subtle: 'var(--text-tertiary)',
  border: 'var(--border-glass)',
};

const ConnectionsHub = () => {
  const navigate = useNavigate();
  const [selectedConnection, setSelectedConnection] = React.useState(null);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1100;
  const isDesktop = windowWidth > 1100;

  React.useEffect(() => {
    // Inject custom ping animation keyframes for the connected status dot
    const styleId = 'ping-animation-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes custom-ping {
          0% { transform: scale(1); opacity: 1; }
          70%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const experts = [
    { id: 'exp1', name: 'Lucas Pivovar', phone: '+55 11 99999-9999', niche: 'Vendas & Marketing', status: 'connected', contacts: '1.2k', campaigns: 4 },
    { id: 'exp2', name: 'Clínica Odonto Riso', phone: '+55 11 88888-8888', niche: 'Atendimento & Suporte', status: 'connected', contacts: '850', campaigns: 2 },
    { id: 'exp3', name: 'E-commerce Importados', phone: '+55 11 77777-7777', niche: 'Recuperação de Vendas', status: 'disconnected', contacts: '3.4k', campaigns: 0 },
  ];

  const handleSelectExpert = (expert) => {
    localStorage.setItem('selectedExpert', expert.name);
    navigate('/sender/dashboard');
  };

  if (selectedConnection === 'sender') {
    return (
      <div className="connections-hub-wrapper" style={{ 
        animation: 'pageFadeIn 0.3s ease both', 
        width: '100%', 
        maxWidth: '100%',
        padding: isMobile ? '1.5rem 1rem' : isTablet ? '2.5rem 2rem' : '3rem 4rem',
        boxSizing: 'border-box'
      }}>
        {/* Back Button */}
        <button 
          onClick={() => setSelectedConnection(null)} 
          style={{
            background: 'transparent',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            marginBottom: '1.5rem',
            padding: '8px 16px',
            borderRadius: '99px',
            fontSize: '0.85rem',
            boxShadow: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.color = 'var(--accent-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-glass)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Voltar para o Hub
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '0.5rem', position: 'relative' }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 800, marginBottom: '0.75rem',
            background: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent',
            letterSpacing: '-0.02em', display: 'inline-block'
          }}>
            Selecione a Conta do Expert
          </h1>
          <p style={{ color: B.muted, fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Escolha uma das contas integradas de WhatsApp para gerenciar campanhas e automações.
          </p>
        </div>

        {/* Experts Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(auto-fit, minmax(340px, 1fr))' : 'repeat(auto-fit, minmax(390px, 1fr))', 
          gap: isMobile ? '1.25rem' : isTablet ? '1.75rem' : '2.5rem', 
          width: '100%', 
          maxWidth: '100%', 
          margin: '0 auto' 
        }}>
          {experts.map((exp) => {
            const cardPadding = isMobile ? '2rem 1.5rem' : isTablet ? '2.5rem 2rem' : '3rem 2.5rem';
            const avatarSize = isMobile ? '48px' : '58px';
            const avatarFontSize = isMobile ? '1.15rem' : '1.4rem';
            const avatarBorderRadius = isMobile ? '12px' : '16px';
            const nameFontSize = isMobile ? '1.3rem' : isTablet ? '1.45rem' : '1.6rem';
            const phoneFontSize = isMobile ? '0.85rem' : '0.92rem';
            const nicheFontSize = isMobile ? '0.75rem' : '0.82rem';
            const nichePadding = isMobile ? '4px 10px' : '6px 12px';
            const nicheRadius = isMobile ? '6px' : '8px';
            const metricsFontSize = isMobile ? '0.82rem' : '0.92rem';
            const metricsPaddingTop = isMobile ? '1.25rem' : '1.5rem';
            const iconSize = isMobile ? '14' : '16';
            const manageFontSize = isMobile ? '0.85rem' : '0.92rem';

            return (
              <div
                key={exp.id}
                onClick={() => handleSelectExpert(exp)}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '20px',
                  padding: cardPadding,
                  border: `1px solid ${B.border}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(168, 85, 247, 0.05), 0 10px 10px -5px rgba(168, 85, 247, 0.03)';
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  const svg = e.currentTarget.querySelector('.manage-expert-link svg');
                  if (svg) svg.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.01)';
                  e.currentTarget.style.borderColor = B.border;
                  const svg = e.currentTarget.querySelector('.manage-expert-link svg');
                  if (svg) svg.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: avatarSize, height: avatarSize, borderRadius: avatarBorderRadius,
                    background: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FFFFFF', fontWeight: '800', fontSize: avatarFontSize,
                    boxShadow: '0 4px 10px rgba(168, 85, 247, 0.15)'
                  }}>
                    {exp.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {exp.status === 'connected' ? (
                      <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                        <span style={{
                          position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%',
                          backgroundColor: '#10b981', opacity: 0.75,
                          animation: 'custom-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                        }} />
                        <span style={{
                          position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px',
                          backgroundColor: '#10b981'
                        }} />
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px',
                        backgroundColor: '#9ca3af'
                      }} />
                    )}
                    <span style={{
                      fontSize: isMobile ? '0.75rem' : '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em',
                      color: exp.status === 'connected' ? '#10b981' : '#6b7280'
                    }}>
                      {exp.status === 'connected' ? 'Conectado' : 'Inativo'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: nameFontSize, fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{exp.name}</h3>
                  <span style={{ fontSize: phoneFontSize, color: 'var(--text-tertiary)', fontFamily: 'monospace', display: 'block' }}>{exp.phone}</span>
                  <span style={{ 
                    display: 'inline-block', fontSize: nicheFontSize, fontWeight: '700',
                    color: 'var(--accent-primary)', background: 'rgba(168, 85, 247, 0.06)',
                    padding: nichePadding, borderRadius: nicheRadius, marginTop: '8px'
                  }}>
                    {exp.niche}
                  </span>
                </div>

                <div style={{ 
                  display: 'flex', justifyContent: 'space-between', fontSize: metricsFontSize, color: 'var(--text-secondary)',
                  marginTop: 'auto', paddingTop: metricsPaddingTop, borderTop: '1px solid var(--border-glass)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Total de contatos">
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)' }}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>Contatos: <strong>{exp.contacts}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Campanhas ativas">
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)' }}>
                      <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                    <span>Campanhas: <strong>{exp.campaigns}</strong></span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '4px', fontSize: manageFontSize, fontWeight: '700', 
                  color: 'var(--accent-primary)', marginTop: '2px', opacity: 0.85, transition: 'all 0.22s ease'
                }} className="manage-expert-link">
                  Gerenciar Conta
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.22s ease' }}>
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="connections-hub-wrapper">
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '1rem', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
          width: '400px', height: '400px', background: 'rgba(168,85,247,0.05)', filter: 'blur(100px)', zIndex: -1, pointerEvents: 'none'
        }} />
        <h1 style={{ 
          fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '0.75rem',
          background: 'linear-gradient(135deg, #111827 0%, #4B5563 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em'
        }}>
          Hub de Conexões
        </h1>
        <p style={{ color: B.muted, fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Gerencie seus canais, disparadores e extratores em um único lugar. Selecione uma conexão para acessar o painel de controle.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Sender Card */}
        <div 
          onClick={() => setSelectedConnection('sender')}
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            border: `1px solid ${B.border}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 24px 48px -12px rgba(168, 85, 247, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.02)';
            e.currentTarget.style.borderColor = B.border;
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
            background: 'linear-gradient(90deg, #A855F7, #7E22CE)', opacity: 0.9
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '16px', 
              background: 'rgba(168, 85, 247, 0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: B.lime
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </div>
            <span style={{ 
              padding: '0.4rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', 
              borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>Ativo</span>
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: B.text, letterSpacing: '-0.01em' }}>Sender</h2>
            <p style={{ color: B.muted, fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
              Plataforma completa de campanhas, disparos automáticos e gestão de contatos massivos.
            </p>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', color: B.lime, fontWeight: 700, fontSize: '0.95rem' }}>
            Acessar Painel 
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px' }}>
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </div>

        {/* Channel Card */}
        <div 
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            border: `1px solid ${B.border}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
            opacity: 0.65,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '16px', 
              background: '#F3F4F6', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: B.subtle
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
              </svg>
            </div>
            <span style={{ 
              padding: '0.4rem 1rem', background: '#F3F4F6', color: B.subtle, 
              borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' 
            }}>Em Breve</span>
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: B.text, letterSpacing: '-0.01em' }}>Channel</h2>
            <p style={{ color: B.muted, fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
              Conexões multi-canal para recebimento e centralização inteligente de atendimento.
            </p>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', color: B.subtle, fontWeight: 700, fontSize: '0.95rem' }}>
            Disponível Futuramente
          </div>
        </div>

        {/* Extrator Card */}
        <div 
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            border: `1px solid ${B.border}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
            opacity: 0.65,
            cursor: 'not-allowed',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '16px', 
              background: '#F3F4F6', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: B.subtle
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <span style={{ 
              padding: '0.4rem 1rem', background: '#F3F4F6', color: B.subtle, 
              borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' 
            }}>Em Breve</span>
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: B.text, letterSpacing: '-0.01em' }}>Extrator</h2>
            <p style={{ color: B.muted, fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
              Captação avançada de leads e extração de dados inteligente em massa.
            </p>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', color: B.subtle, fontWeight: 700, fontSize: '0.95rem' }}>
            Disponível Futuramente
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConnectionsHub;
