import React, { useState } from 'react';
import toast from 'react-hot-toast';

const B = {
  lime: 'var(--accent-primary)',
  text: 'var(--text-primary)',
  muted: 'var(--text-secondary)',
  border: 'var(--border-glass)',
  bgCard: 'var(--bg-card)',
};

const Planos = () => {
  const [activePlan, setActivePlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('mensal'); // 'mensal' | 'anual'

  const plansList = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfeito para começar',
      priceMonthly: 97,
      priceYearly: 77,
      features: [
        { text: '1.000 disparos/mês', included: true },
        { text: '1 Conexão WhatsApp', included: true },
        { text: 'Criador de Fluxos Básico', included: true },
        { text: 'Relatórios Avançados', included: false },
      ],
      badge: null
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Para negócios em crescimento',
      priceMonthly: 297,
      priceYearly: 237,
      features: [
        { text: '10.000 disparos/mês', included: true },
        { text: '3 Conexões WhatsApp', included: true },
        { text: 'Criador de Fluxos Avançado', included: true },
        { text: 'Relatórios Completos', included: true },
      ],
      badge: 'RECOMENDADO'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Operação em grande escala',
      priceMonthly: 997,
      priceYearly: 797,
      features: [
        { text: 'Disparos Ilimitados', included: true },
        { text: '10+ Conexões WhatsApp', included: true },
        { text: 'IA Integrada (ChatGPT)', included: true },
        { text: 'Suporte Dedicado 24/7', included: true },
      ],
      badge: 'ESCALÁVEL'
    }
  ];

  const handlePlanAction = (planId) => {
    if (planId === activePlan) {
      toast.success('Você já está utilizando este plano!');
      return;
    }
    
    const actionText = planId === 'enterprise' || activePlan === 'enterprise' 
      ? 'Fale com nosso time comercial para ativar.' 
      : `Plano alterado para ${planId.toUpperCase()} com sucesso!`;
      
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));
    toast.promise(promise, {
      loading: 'Processando alteração...',
      success: () => {
        if (planId !== 'enterprise') {
          setActivePlan(planId);
        }
        return actionText;
      },
      error: 'Erro ao processar. Tente novamente.',
    });
  };

  const getPlanDetails = () => {
    switch (activePlan) {
      case 'starter':
        return { name: 'Starter', limit: '1.000', used: '450', percent: '45%', conns: '1 / 1' };
      case 'pro':
        return { name: 'Pro', limit: '10.000', used: '4.250', percent: '42.5%', conns: '2 / 3' };
      case 'enterprise':
        return { name: 'Enterprise', limit: 'Ilimitado', used: '24.500', percent: '15%', conns: '8 / 15' };
      default:
        return { name: 'Pro', limit: '10.000', used: '4.250', percent: '42.5%', conns: '2 / 3' };
    }
  };

  const details = getPlanDetails();

  return (
    <div className="page-container fade-in" style={{ padding: '1.25rem 1.5rem', paddingBottom: '2.5rem', width: '100%', maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Title Header */}
      <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: B.text, fontWeight: '800', letterSpacing: '-0.02em' }}>
          Gerenciamento de Assinatura e Planos
        </h1>
        <p style={{ color: B.muted, fontSize: '1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
          Gerencie seu plano atual, acompanhe o consumo das cotas ou mude de plano a qualquer momento.
        </p>
      </div>

      {/* Widget: Current Plan details */}
      <div style={{
        background: B.bgCard,
        border: `1px solid ${B.border}`,
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative background gradient */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '220px', height: '220px',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.04) 0%, rgba(59, 130, 246, 0.04) 100%)',
          borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none', zIndex: 0
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(168, 85, 247, 0.1)',
                color: 'var(--accent-primary)',
                padding: '4px 12px',
                borderRadius: '99px',
                fontSize: '0.75rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Plano Ativo
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                padding: '4px 12px',
                borderRadius: '99px',
                fontSize: '0.75rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Renovação automática ativa
              </span>
            </div>
            
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '12px 0 6px 0', color: B.text }}>
              MassFlow {details.name}
            </h2>
            <span style={{ fontSize: '0.85rem', color: B.muted }}>
              Cobrado mensalmente • Próxima fatura em 25/06/2026 (Visa final 4242)
            </span>
          </div>
          
          <div style={{ textAlign: 'right', minWidth: '150px' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: B.text }}>
              R$ {activePlan === 'starter' ? '97,00' : activePlan === 'pro' ? '297,00' : '997,00'}
              <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: B.muted }}>/mês</span>
            </div>
            <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: '700', display: 'block', marginTop: '4px' }}>
              ✓ Assinatura em dia
            </span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: `1px solid ${B.border}`, margin: 0, zIndex: 1 }} />

        {/* Quotas / Usage Progress Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', zIndex: 1 }}>
          
          {/* Messages Metric */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: B.text }}>
              <span style={{ color: B.muted, fontWeight: '600' }}>Disparos de WhatsApp</span>
              <strong>{details.used} / {details.limit} envios</strong>
            </div>
            {/* Progress Bar Container */}
            <div style={{ width: '100%', height: '8px', background: 'rgba(107, 114, 128, 0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{
                width: details.percent,
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent-primary) 0%, #3b82f6 100%)',
                borderRadius: '99px'
              }} />
            </div>
            <span style={{ fontSize: '0.78rem', color: B.muted }}>
              Franquia de envios reinicia em 14 dias ({details.percent} consumido).
            </span>
          </div>

          {/* Connections Metric */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: B.text }}>
              <span style={{ color: B.muted, fontWeight: '600' }}>Conexões WhatsApp</span>
              <strong>{details.conns} utilizadas</strong>
            </div>
            {/* Progress Bar Container */}
            <div style={{ width: '100%', height: '8px', background: 'rgba(107, 114, 128, 0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{
                width: activePlan === 'starter' ? '100%' : activePlan === 'pro' ? '66.7%' : '53.3%',
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent-primary) 0%, #3b82f6 100%)',
                borderRadius: '99px'
              }} />
            </div>
            <span style={{ fontSize: '0.78rem', color: B.muted }}>
              {activePlan === 'starter' ? 'Limite máximo atingido. Faça upgrade para conectar mais.' : 'Você ainda possui canais disponíveis para conexão.'}
            </span>
          </div>

        </div>
      </div>

      {/* Toggle Billing Cycle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'inline-flex',
          background: B.bgCard,
          border: `1px solid ${B.border}`,
          borderRadius: '99px',
          padding: '4px',
        }}>
          <button
            onClick={() => setBillingCycle('mensal')}
            style={{
              padding: '8px 18px',
              borderRadius: '99px',
              border: 'none',
              background: billingCycle === 'mensal' ? 'var(--accent-primary)' : 'transparent',
              color: billingCycle === 'mensal' ? '#FFFFFF' : B.muted,
              fontSize: '0.88rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Faturamento Mensal
          </button>
          <button
            onClick={() => setBillingCycle('anual')}
            style={{
              padding: '8px 18px',
              borderRadius: '99px',
              border: 'none',
              background: billingCycle === 'anual' ? 'var(--accent-primary)' : 'transparent',
              color: billingCycle === 'anual' ? '#FFFFFF' : B.muted,
              fontSize: '0.88rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Faturamento Anual
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              padding: '2px 6px',
              borderRadius: '6px',
              fontSize: '0.68rem',
              fontWeight: '800'
            }}>
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Card Deck */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
        
        {plansList.map((plan) => {
          const isSelected = activePlan === plan.id;
          const price = billingCycle === 'mensal' ? plan.priceMonthly : plan.priceYearly;
          
          return (
            <div
              key={plan.id}
              style={{
                flex: '1 1 300px',
                maxWidth: '350px',
                padding: '2.5rem 2rem',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                background: isSelected 
                  ? 'linear-gradient(145deg, rgba(168,85,247,0.04) 0%, rgba(59,130,246,0.04) 100%)' 
                  : B.bgCard,
                border: isSelected 
                  ? '2px solid var(--accent-primary)' 
                  : `1px solid ${B.border}`,
                boxShadow: 'none',
                position: 'relative',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = B.border;
                }
              }}
            >
              {/* Card Header & Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.45rem', margin: '0 0 4px 0', color: B.text, fontWeight: '800' }}>
                    {plan.name}
                  </h3>
                  <p style={{ margin: 0, color: B.muted, fontSize: '0.85rem' }}>
                    {plan.description}
                  </p>
                </div>
                {plan.badge && (
                  <span style={{
                    background: isSelected ? 'var(--accent-primary)' : 'rgba(168, 85, 247, 0.1)',
                    color: isSelected ? '#FFFFFF' : 'var(--accent-primary)',
                    padding: '4px 10px',
                    borderRadius: '99px',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    letterSpacing: '0.05em'
                  }}>
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Price Block */}
              <div style={{ display: 'flex', alignItems: 'baseline', color: B.text }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', marginRight: '2px' }}>R$</span>
                <span style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {price}
                </span>
                <span style={{ fontSize: '0.9rem', color: B.muted, marginLeft: '4px' }}>/mês</span>
              </div>

              <hr style={{ border: 'none', borderTop: `1px solid ${B.border}`, margin: 0 }} />

              {/* Features List */}
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
                color: B.text,
                fontSize: '0.92rem'
              }}>
                {plan.features.map((feature, fIdx) => (
                  <li
                    key={fIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      opacity: feature.included ? 1 : 0.45
                    }}
                  >
                    {feature.included ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    )}
                    <span style={{ color: feature.included ? B.text : B.muted }}>{feature.text}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                {isSelected ? (
                  <button
                    disabled
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '12px',
                      border: '2px solid rgba(16, 185, 129, 0.4)',
                      background: 'rgba(16, 185, 129, 0.04)',
                      color: '#10b981',
                      fontWeight: '700',
                      fontSize: '0.92rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: 'none',
                      cursor: 'default'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Plano Atual
                  </button>
                ) : (
                  <button
                    onClick={() => handlePlanAction(plan.id)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: plan.id === 'enterprise' ? `1px solid ${B.border}` : 'none',
                      background: plan.id === 'enterprise' ? 'transparent' : 'var(--accent-primary)',
                      color: plan.id === 'enterprise' ? B.text : '#FFFFFF',
                      fontWeight: '700',
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      boxShadow: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (plan.id !== 'enterprise') {
                        e.currentTarget.style.filter = 'brightness(1.1)';
                      } else {
                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (plan.id !== 'enterprise') {
                        e.currentTarget.style.filter = 'none';
                      } else {
                        e.currentTarget.style.borderColor = B.border;
                      }
                    }}
                  >
                    {plan.id === 'enterprise' ? 'Falar com Vendas' : 'Ativar Plano'}
                  </button>
                )}
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default Planos;
