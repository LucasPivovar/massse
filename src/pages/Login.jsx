import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import logoImage from '../assets/logo-branco.png';
import authBgImage from '../assets/auth_background.png';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = ({ onLogin }) => {
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
    <div className="auth-outer">
      <div className="auth-container">
        {/* Left Side: Form Container */}
        <div className="auth-form-side">
          {/* Brand Header */}
          <div style={styles.brandHeader}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={logoImage}
                alt="MassFlow Logo"
                style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>

          {view === 'login' && (
            <form onSubmit={handleSubmit} style={styles.form}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 1.5rem 0', textAlign: 'center' }}>Faça o seu login</h2>

              <div className="input-group">
                <label style={styles.label}>usuário</label>
                <div style={{ position: 'relative' }}>
                  <span style={styles.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Qualquer usuário"
                    style={{ ...styles.input, paddingLeft: '2.8rem' }}
                    required
                  />
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label style={styles.label}>senha</label>
                <div style={{ position: 'relative' }}>
                  <span style={styles.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Qualquer senha"
                    style={{ ...styles.input, paddingLeft: '2.8rem', paddingRight: '2.8rem' }}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeToggleBtn}
                    title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password simulation row */}
              <div style={styles.extraRow}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={styles.checkboxInput}
                  />
                  <span>Lembrar meu acesso</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); setView('forgot'); setError(''); }} style={styles.forgotLink}>
                  esqueci minha senha
                </a>
              </div>

              {error && <p className="error-message" style={styles.error}>{error}</p>}
              {success && <p className="success-message" style={styles.success}>{success}</p>}

              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? 'Autenticando...' : 'Entrar'}
                {!loading && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                )}
              </button>

              <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
                <span style={{ color: '#ffffff', fontSize: '0.85rem' }}>Ainda não possui uma conta? </span>
                <a href="/register" onClick={(e) => { e.preventDefault(); window.location.href = '/register'; }} style={{ ...styles.forgotLink, textDecoration: 'underline' }}>
                  Cadastre-se
                </a>
              </div>
            </form>
          )}

          {view === 'login_2fa' && (
            <form onSubmit={handle2FASubmit} style={styles.form}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 1.5rem 0', textAlign: 'center' }}>autenticação <span style={{ color: '#A855F7' }}>•</span></h2>

              <div className="input-group" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <label style={{ ...styles.label, textAlign: 'center' }}>código 2fa</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="input-2fa"
                    value={code2fa}
                    onChange={(e) => setCode2fa(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    required
                  />
                </div>
                <small style={{ color: 'var(--text-tertiary)', display: 'block', marginTop: '10px', textAlign: 'center' }}>
                  Insira o código enviado para seu dispositivo.
                </small>
              </div>

              {error && <p className="error-message" style={styles.error}>{error}</p>}

              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? 'Verificando...' : 'Confirmar Acesso'}
              </button>
              <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
                <a href="#login" onClick={(e) => { e.preventDefault(); setView('login'); setError(''); setCode2fa(''); }} style={styles.forgotLink}>
                  Voltar
                </a>
              </div>
            </form>
          )}

          {view === 'forgot' && (
            <form onSubmit={handleForgotSubmit} style={styles.form}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 1.5rem 0', textAlign: 'center' }}>recuperar senha <span style={{ color: '#A855F7' }}>•</span></h2>

              <div className="input-group" style={{ marginBottom: '2rem' }}>
                <label style={styles.label}>e-mail cadastrado</label>
                <div style={{ position: 'relative' }}>
                  <span style={styles.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="seu-email@dominio.com"
                    style={{ ...styles.input, paddingLeft: '2.8rem' }}
                    required
                  />
                </div>
              </div>

              {error && <p className="error-message" style={styles.error}>{error}</p>}

              <button type="submit" disabled={forgotLoading} style={{ ...styles.button, whiteSpace: 'nowrap' }}>
                {forgotLoading ? 'Enviando Instruções...' : 'Enviar Link de Redefinição'}
                {!forgotLoading && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                )}
              </button>

              <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
                <a href="#login" onClick={(e) => { e.preventDefault(); setView('login'); setError(''); }} style={styles.forgotLink}>
                  Voltar para o Login
                </a>
              </div>
            </form>
          )}

          {view === 'forgot_2fa' && (
            <form onSubmit={handleForgot2FASubmit} style={styles.form}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 1.5rem 0', textAlign: 'center' }}>autenticação <span style={{ color: '#A855F7' }}>•</span></h2>

              <div className="input-group" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <label style={{ ...styles.label, textAlign: 'center' }}>código de recuperação</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="input-2fa"
                    value={code2fa}
                    onChange={(e) => setCode2fa(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    required
                  />
                </div>
                <small style={{ color: 'var(--text-tertiary)', display: 'block', marginTop: '10px', textAlign: 'center' }}>
                  Insira o código de 6 dígitos enviado para o seu e-mail.
                </small>
              </div>

              {error && <p className="error-message" style={styles.error}>{error}</p>}

              <button type="submit" disabled={forgotLoading} style={styles.button}>
                {forgotLoading ? 'Verificando...' : 'Verificar Código'}
              </button>
              <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); setView('forgot'); setError(''); setCode2fa(''); }} style={styles.forgotLink}>
                  Voltar
                </a>
              </div>
            </form>
          )}

          {view === 'forgot_success' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(168, 85, 247,0.1)',
                color: '#A855F7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 0 22px rgba(168, 85, 247,0.18)',
                border: '1px solid rgba(168, 85, 247,0.2)'
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>Instruções Enviadas!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 2rem 0' }}>
                Enviamos um link seguro de redefinição de senha para o endereço de e-mail informado. Por favor, verifique sua caixa de entrada e spam.
              </p>
              <button type="button" onClick={() => { setView('login'); setForgotEmail(''); }} style={{ ...styles.button, width: '100%' }}>
                Voltar para o Login
              </button>
            </div>
          )}

          <div style={styles.footer}>
          </div>
        </div>

        {/* Right Side: Image Sidebar */}
        <div className="auth-image-side" style={{ backgroundImage: `url(${authBgImage})` }} />
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
