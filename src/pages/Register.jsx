import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import logoImage from '../assets/logo_massflow.png';
import authBgImage from '../assets/auth_background.png';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1 data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 & 3 data
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');

  // Dummy token for final login
  const [tempToken, setTempToken] = useState('');

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 860);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 860);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, { name, email, password, phone });
      setTempToken(response.data.token || 'mock_fallback_token');
      setStep(2);
      toast.success('Cadastro inicial realizado. Um código foi enviado para seu e-mail.');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar o cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Simulating email 2FA verification
      await new Promise(resolve => setTimeout(resolve, 800));
      if (emailCode.length === 6) {
        setStep(3);
        toast.success('E-mail verificado! Enviamos agora um código SMS para o seu celular.');
      } else {
        setError('Código inválido. Digite os 6 dígitos.');
      }
    } catch (err) {
      setError('Erro ao verificar código de e-mail.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Simulating phone 2FA verification
      await new Promise(resolve => setTimeout(resolve, 800));
      if (phoneCode.length === 6) {
        toast.success('Cadastro concluído com sucesso!');
        // Success! Log the user in
        onLogin(tempToken);
      } else {
        setError('Código inválido. Digite os 6 dígitos.');
      }
    } catch (err) {
      setError('Erro ao verificar código SMS.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      minHeight: '100vh',
      background: '#F8F7FA',
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
          background: 'linear-gradient(135deg, #180D2C 0%, #0B0518 100%)',
          backgroundImage: 'radial-gradient(rgba(168, 85, 247, 0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          borderRight: '1px solid rgba(168, 85, 247, 0.15)',
          position: 'relative',
          boxSizing: 'border-box'
        }}>
          {/* Subtle Ambient Glow */}
          <div style={{
            position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px',
            background: 'rgba(168, 85, 247, 0.15)', filter: 'blur(100px)', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: '20%', right: '10%', width: '250px', height: '250px',
            background: 'rgba(126, 34, 206, 0.15)', filter: 'blur(90px)', pointerEvents: 'none'
          }} />

          {/* Pill Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
            <span style={{
              background: 'rgba(168, 85, 247, 0.2)',
              color: '#D8B4FE',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '560px', margin: 'auto 0', zIndex: 2 }}>
            <h1 style={{
              fontSize: 'clamp(2.2rem, 4.2vw, 2.8rem)',
              fontWeight: '800',
              lineHeight: 1.15,
              margin: 0,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              background: 'none',
              WebkitTextFillColor: 'initial',
              display: 'block'
            }}>
              Comunique-se em massa,<br />
              <span style={{
                background: 'linear-gradient(135deg, #C084FC 0%, #A855F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent'
              }}>
                sem complicação.
              </span>
            </h1>
            
            <p style={{ color: '#9CA3AF', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              Painel de controle para gerenciar seus disparos, criar automações interativas e gerenciar contatos de forma eficiente e centralizada.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#D8B4FE', flexShrink: 0
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </div>
                <div>
                  <strong style={{ color: '#FFFFFF', display: 'block', fontSize: '0.92rem', fontWeight: '700' }}>Envios em massa</strong>
                  <span style={{ color: '#9CA3AF', fontSize: '0.82rem', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>Crie campanhas e envie mensagens massivas com alta performance.</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#D8B4FE', flexShrink: 0
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"/>
                    <circle cx="12" cy="5" r="2"/>
                    <path d="M12 7v4"/>
                  </svg>
                </div>
                <div>
                  <strong style={{ color: '#FFFFFF', display: 'block', fontSize: '0.92rem', fontWeight: '700' }}>Automações visuais</strong>
                  <span style={{ color: '#9CA3AF', fontSize: '0.82rem', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>Configure fluxos interativos de atendimento e respostas automáticas.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#D8B4FE', flexShrink: 0
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <strong style={{ color: '#FFFFFF', display: 'block', fontSize: '0.92rem', fontWeight: '700' }}>Contatos e leads</strong>
                  <span style={{ color: '#9CA3AF', fontSize: '0.82rem', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>Importe listas, filtre por tags e organize seus leads perfeitamente.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: '0.78rem', zIndex: 2 }}>
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
        background: '#FAF9FC',
        backgroundImage: 'radial-gradient(rgba(168, 85, 247, 0.08) 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E5E5E9',
          borderRadius: '24px',
          padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem',
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '0 8px 30px rgba(126, 34, 206, 0.04)',
          boxSizing: 'border-box'
        }}>
          {/* Form Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)'
            }} />
            <span style={{
              fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em',
              color: 'var(--text-secondary)'
            }}>
              Cadastro
            </span>
          </div>

          {/* Stepper Indicator */}
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ 
                  flex: 1,
                  height: '6px', 
                  background: step === i 
                    ? 'var(--accent-flow)' 
                    : step > i 
                      ? 'var(--accent-primary)' 
                      : 'var(--border-glass)',
                  borderRadius: '99px',
                  transition: 'all 0.3s ease'
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              <span style={{ color: step >= 1 ? 'var(--accent-primary)' : 'inherit' }}>Dados</span>
              <span style={{ color: step >= 2 ? 'var(--accent-primary)' : 'inherit' }}>E-mail</span>
              <span style={{ color: step >= 3 ? 'var(--accent-primary)' : 'inherit' }}>SMS</span>
            </div>
          </div>

          {success && <p style={{ color: '#10b981', fontSize: '0.82rem', margin: 0, fontWeight: '600' }}>{success}</p>}
          {error && <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: 0, fontWeight: '600' }}>{error}</p>}

          {step === 1 && (
            <form onSubmit={handleStep1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Nome Completo
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Seu nome"
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
                  E-mail
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="seu@email.com"
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
                  Celular
                </label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, '');
                    if (v.length > 11) v = v.slice(0, 11);
                    if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
                    if (v.length > 10) v = `${v.slice(0, 10)}-${v.slice(10)}`;
                    setPhone(v);
                  }} 
                  placeholder="(11) 90000-0000"
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
                    title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
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
                {loading ? 'Processando...' : 'Próxima Etapa'}
                {!loading && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                )}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Já possui conta?{' '}
                <a 
                  href="/login" 
                  onClick={(e) => { e.preventDefault(); window.location.href = '/login'; }} 
                  style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '700' }}
                >
                  Faça login
                </a>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2Submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  Código de E-mail
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0, lineHeight: 1.4 }}>
                  Insira o código de 6 dígitos enviado para {email || 'seu e-mail'}.
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <input 
                  type="text" 
                  value={emailCode} 
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
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
                {loading ? 'Verificando...' : 'Verificar E-mail'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    boxShadow: 'none',
                    padding: 0
                  }}
                >
                  Voltar e editar dados
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleStep3Submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  Código SMS
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0, lineHeight: 1.4 }}>
                  Insira o código de 6 dígitos enviado para {phone || 'seu celular'}.
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <input 
                  type="text" 
                  value={phoneCode} 
                  onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
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
                {loading ? 'Concluindo...' : 'Finalizar Cadastro'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setStep(2)} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    boxShadow: 'none',
                    padding: 0
                  }}
                >
                  Voltar
                </button>
              </div>
            </form>
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
    maxWidth: '460px',
    width: '100%',
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10
  },
  brandHeader: {
    marginTop: '2rem',
    marginBottom: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
  stepperContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '0.5rem',
    padding: '0 10px'
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
    letterSpacing: '-0.01em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px'
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    pointerEvents: 'none',
    opacity: 0.8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  eyeToggleBtn: {
    position: 'absolute',
    right: '0.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 'auto',
    margin: 0
  },
  link: {
    fontFamily: 'Inter, sans-serif',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s',
    fontSize: '0.85rem'
  },
  forgotLink: {
    fontFamily: 'Inter, sans-serif',
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.85rem',
    boxShadow: 'none',
    transition: 'opacity 0.2s'
  },
  linkBtn: {
    fontFamily: 'Inter, sans-serif',
    background: 'none',
    border: 'none',
    color: '#A855F7',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.85rem',
    boxShadow: 'none',
    padding: 0
  }
};

export default Register;
