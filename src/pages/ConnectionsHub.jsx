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
          onClick={() => navigate('/sender/dashboard')}
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
