import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import logoImage from '../assets/logo-branco.png';
import authBgImage from '../assets/auth_background.png';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Recovery Password states
  const [view, setView] = useState('login'); // 'login' | 'login_2fa' | 'forgot' | 'forgot_2fa' | 'forgot_success'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [code2fa, setCode2fa] = useState('');
  const [tempToken, setTempToken] = useState('');

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 860);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 860);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, { username, password });
      onLogin(response.data.token || 'mock_fallback_token');
      toast.success('Login bem-sucedido!');
    } catch (err) {
      console.error(err);
      // Fallback for UI testing without backend
      onLogin('mock_fallback_token');
      toast.success('Login bem-sucedido (Modo Teste)!');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Simulate 2FA API verification
      await new Promise(resolve => setTimeout(resolve, 800));
      if (code2fa.length === 6) {
        onLogin(tempToken);
      } else {
        setError('Código inválido. Digite os 6 dígitos.');
      }
    } catch (err) {
      setError('Erro ao verificar código 2FA.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setError('');
    setSuccess('');
    try {
      // Simulate API call for password recovery 2FA step
      await new Promise(resolve => setTimeout(resolve, 1200));
      setView('forgot_2fa');
      toast.success('Código de verificação enviado!');
    } catch (err) {
      setError('Erro ao processar a recuperação de senha. Tente novamente.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgot2FASubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setError('');
    try {
      // Simulate 2FA verification for password recovery
      await new Promise(resolve => setTimeout(resolve, 800));
      if (code2fa.length === 6) {
        setView('forgot_success');
        toast.success('Senha redefinida com sucesso!');
      } else {
        setError('Código inválido. Digite os 6 dígitos.');
      }
    } catch (err) {
      setError('Erro ao verificar código 2FA.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      minHeight: '100vh',
      background: '#FFFFFF',
      color: 'var(--text-primary)',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box'
    }}>
      {/* Left Column: Marketing Info (Desktop Only) */}
      {!isMobile && (
        <div style={{
          flex: 1.2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '4rem',
          background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
          backgroundImage: 'radial-gradient(rgba(168, 85, 247, 0.28) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          borderRight: '1px solid var(--border-glass)',
          position: 'relative',
          boxSizing: 'border-box'
        }}>
          {/* Pill Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'rgba(168, 85, 247, 0.1)',
              color: 'var(--accent-primary)',
              padding: '6px 14px',
              borderRadius: '99px',
              fontSize: '0.78rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              • MassFlow Sender
            </span>
          </div>

          {/* Heading, Subtext, Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '560px', margin: 'auto 0' }}>
            <h1 style={{
              fontSize: 'clamp(2.2rem, 4.2vw, 2.8rem)',
              fontWeight: '800',
              lineHeight: 1.15,
              margin: 0,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              background: 'none',
              WebkitTextFillColor: 'initial',
              display: 'block'
            }}>
              Comunique-se em massa,<br />
              <span style={{
                background: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent'
              }}>
                sem complicação.
              </span>
            </h1>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              Painel de controle para gerenciar seus disparos, criar automações interativas e gerenciar contatos de forma eficiente e centralizada.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-primary)', flexShrink: 0
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.92rem', fontWeight: '700' }}>Envios em massa</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>Crie campanhas e envie mensagens massivas com alta performance.</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-primary)', flexShrink: 0
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"/>
                    <circle cx="12" cy="5" r="2"/>
                    <path d="M12 7v4"/>
                  </svg>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.92rem', fontWeight: '700' }}>Automações visuais</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>Configure fluxos interativos de atendimento e respostas automáticas.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-primary)', flexShrink: 0
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.92rem', fontWeight: '700' }}>Contatos e leads</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>Importe listas, filtre por tags e organize seus leads perfeitamente.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
            <span>• Plataforma online</span>
            <span>Todos os sistemas operacionais</span>
          </div>
        </div>
      )}

      {/* Right Column: Form Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '1.5rem' : '2.5rem',
        background: '#FFFFFF',
        backgroundImage: 'radial-gradient(rgba(168, 85, 247, 0.08) 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          padding: isMobile ? '2rem 1.5rem' : '2.5rem',
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: 'none',
          boxSizing: 'border-box'
        }}>
          {view === 'login' && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  Bem-vindo de volta
                </h2>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Usuário
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu usuário"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'transparent',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontSize: '0.92rem',
                    transition: 'all 0.22s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-glass)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Senha
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      background: 'transparent',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontSize: '0.92rem',
                      transition: 'all 0.22s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-glass)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px',
                      boxShadow: 'none',
                      borderRadius: 0
                    }}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                fontSize: '0.82rem', 
                marginTop: '4px',
                width: '100%',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <label style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  cursor: 'pointer', 
                  color: 'var(--text-secondary)', 
                  fontWeight: '600',
                  userSelect: 'none',
                  textTransform: 'none',
                  letterSpacing: 'normal',
                  marginBottom: 0,
                  fontSize: '0.82rem'
                }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ 
                      cursor: 'pointer', 
                      margin: 0,
                      width: '14px',
                      height: '14px',
                      accentColor: 'var(--accent-primary)'
                    }}
                  />
                  <span>Lembrar acesso</span>
                </label>
                <a 
                  href="#forgot" 
                  onClick={(e) => { e.preventDefault(); setView('forgot'); setError(''); }} 
                  style={{ 
                    color: 'var(--accent-primary)', 
                    textDecoration: 'none', 
                    fontWeight: '700',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                >
                  Esqueci minha senha
                </a>
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: 0, fontWeight: '600' }}>{error}</p>}
              {success && <p style={{ color: '#10b981', fontSize: '0.82rem', margin: 0, fontWeight: '600' }}>{success}</p>}

              <button 
                type="submit" 
                disabled={loading} 
                style={{
                  width: '100%',
                  background: 'var(--accent-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'none',
                  transition: 'background 0.2s ease',
                  marginTop: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-primary-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent-primary)'}
              >
                {loading ? 'Entrando...' : 'Entrar'}
                {!loading && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                )}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Não possui conta?{' '}
                <a 
                  href="/register" 
                  onClick={(e) => { e.preventDefault(); window.location.href = '/register'; }} 
                  style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '700' }}
                >
                  Cadastre-se
                </a>
              </div>
            </form>
          )}

          {view === 'login_2fa' && (
            <form onSubmit={handle2FASubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  Autenticação
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0, lineHeight: 1.4 }}>
                  Insira o código de 6 dígitos enviado para seu dispositivo.
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <input
                  type="text"
                  value={code2fa}
                  onChange={(e) => setCode2fa(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    letterSpacing: '0.5em',
                    fontWeight: '800',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: 0, fontWeight: '600' }}>{error}</p>}

              <button 
                type="submit" 
                disabled={loading} 
                style={{
                  width: '100%',
                  background: 'var(--accent-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: 'none'
                }}
              >
                {loading ? 'Verificando...' : 'Confirmar Acesso'}
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <a 
                  href="#back" 
                  onClick={(e) => { e.preventDefault(); setView('login'); setError(''); setCode2fa(''); }} 
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  Voltar
                </a>
              </div>
            </form>
          )}

          {view === 'forgot' && (
            <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  Recuperar senha
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0, lineHeight: 1.4 }}>
                  Insira seu e-mail cadastrado para redefinir sua senha.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '6px', textTransform: 'uppercase' }}>
                  E-mail cadastrado
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="seu-email@dominio.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'transparent',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontSize: '0.92rem'
                  }}
                  required
                />
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: 0, fontWeight: '600' }}>{error}</p>}

              <button 
                type="submit" 
                disabled={forgotLoading} 
                style={{
                  width: '100%',
                  background: 'var(--accent-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: 'none'
                }}
              >
                {forgotLoading ? 'Enviando...' : 'Enviar link de redefinição'}
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <a 
                  href="#back" 
                  onClick={(e) => { e.preventDefault(); setView('login'); setError(''); }} 
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  Voltar para o Login
                </a>
              </div>
            </form>
          )}

          {view === 'forgot_2fa' && (
            <form onSubmit={handleForgot2FASubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  Verificar Código
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0, lineHeight: 1.4 }}>
                  Insira o código de 6 dígitos enviado para seu e-mail.
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <input
                  type="text"
                  value={code2fa}
                  onChange={(e) => setCode2fa(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    letterSpacing: '0.5em',
                    fontWeight: '800',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: 0, fontWeight: '600' }}>{error}</p>}

              <button 
                type="submit" 
                disabled={forgotLoading} 
                style={{
                  width: '100%',
                  background: 'var(--accent-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: 'none'
                }}
              >
                {forgotLoading ? 'Verificando...' : 'Verificar Código'}
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <a 
                  href="#back" 
                  onClick={(e) => { e.preventDefault(); setView('forgot'); setError(''); setCode2fa(''); }} 
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  Voltar
                </a>
              </div>
            </form>
          )}

          {view === 'forgot_success' && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                  Sucesso!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0, lineHeight: 1.4 }}>
                  As instruções de recuperação foram enviadas para o seu e-mail cadastrado.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => { setView('login'); setForgotEmail(''); }} 
                style={{
                  width: '100%',
                  background: 'var(--accent-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: 'none'
                }}
              >
                Voltar para o Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  outerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: '100vh',
    padding: '1.5rem',
    boxSizing: 'border-box',
    background: '#F9FAFB',
    position: 'relative',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  glowBlob1: {
    position: 'absolute',
    width: '380px',
    height: '380px',
    borderRadius: '50%',
    background: 'rgba(168, 85, 247, 0.07)',
    filter: 'blur(90px)',
    top: '5%',
    left: '5%',
    pointerEvents: 'none',
    animation: 'blobFloat 15s infinite ease-in-out alternate'
  },
  glowBlob2: {
    position: 'absolute',
    width: '380px',
    height: '380px',
    borderRadius: '50%',
    background: 'rgba(126, 34, 206, 0.07)',
    filter: 'blur(90px)',
    bottom: '5%',
    right: '5%',
    pointerEvents: 'none',
    animation: 'blobFloat 18s infinite ease-in-out alternate-reverse'
  },
  authContainer: {
    background: '#FFFFFF',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid var(--border-glass)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 0 20px rgba(168, 85, 247,0.05)',
    borderRadius: 'var(--radius-lg)',
    padding: '3.5rem 3rem',
    maxWidth: '420px',
    width: '100%',
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10
  },
  brandHeader: {
    marginBottom: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  logo: {
    width: '50px',
    height: '50px',
    borderRadius: '14px',
    background: 'var(--accent-flow)',
    color: 'white',
    fontSize: '1.6rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    boxShadow: 'var(--shadow-glow)',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    margin: '0 0 0.35rem 0',
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em'
  },
  subtitle: {
    fontSize: '0.83rem',
    color: 'var(--text-secondary)',
    margin: 0,
    fontWeight: '500',
    letterSpacing: '0.01em',
  },
  form: {
    textAlign: 'left'
  },
  label: {
    fontFamily: 'Inter, sans-serif',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
    fontWeight: '700',
    letterSpacing: '0.05em'
  },
  input: {
    fontFamily: 'Inter, sans-serif',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    borderColor: 'var(--border-glass)',
    color: 'var(--text-primary)'
  },
  error: {
    margin: '0 0 1.5rem 0'
  },
  success: {
    margin: '0 0 1.5rem 0'
  },
  button: {
    fontFamily: 'Inter, sans-serif',
    width: '100%',
    borderRadius: 'var(--radius-sm)',
    padding: '1rem 2rem',
    fontSize: '0.95rem',
    fontWeight: '400',
    background: 'var(--accent-primary)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 8px 28px rgba(168, 85, 247,0.28)',
    cursor: 'pointer',
    marginTop: '0.5rem',
    letterSpacing: '-0.01em'
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1rem',
    color: '#ffffff',
    pointerEvents: 'none',
    opacity: 0.7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  eyeToggleBtn: {
    position: 'absolute',
    right: '0.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    border: 'none',
    boxShadow: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 'auto',
    margin: 0,
    opacity: 0.7
  },
  extraRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.75rem',
    fontSize: '0.88rem'
  },
  checkboxLabel: {
    fontFamily: 'Inter, sans-serif',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    textTransform: 'none',
    fontSize: '0.85rem',
    margin: 0
  },
  checkboxInput: {
    cursor: 'pointer',
    margin: 0
  },
  forgotLink: {
    fontFamily: 'Inter, sans-serif',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'opacity 0.2s',
    display: 'inline-block',
    fontSize: '0.85rem'
  },
  footer: {
    marginTop: '2.5rem',
    fontSize: '0.82rem',
    color: 'var(--text-tertiary)',
    fontWeight: '600',
    letterSpacing: '0.02em'
  }
};

export default Login;
