import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchBotFlows, deleteBotFlow, getBotChannelLabel } from '../lib/botFlowApi';

const B = {
  lime: 'var(--accent-primary)',
  text: 'var(--text-primary)',
  muted: 'var(--text-secondary)',
  border: 'var(--border-glass)',
};

export default function BotBuilder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [flows, setFlows] = useState([]);

  const loadFlows = useCallback(async () => {
    try {
      const list = await fetchBotFlows();
      setFlows(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFlows();
  }, [loadFlows]);

  const handleDelete = async (e, flow) => {
    e.stopPropagation();
    if (!window.confirm(`Excluir o fluxo "${flow.name}"?`)) return;
    const ok = await deleteBotFlow(flow.id);
    if (ok) {
      toast.success('Fluxo excluído');
      setFlows((prev) => prev.filter((f) => f.id !== flow.id));
    } else {
      toast.error('Não foi possível excluir');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: B.muted, textAlign: 'center' }}>
        Carregando fluxos...
      </div>
    );
  }

  return (
    <div className="page-container pulse-glow" style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: B.text, fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Meus Fluxos</h1>
          <p style={{ color: B.muted, marginTop: 8 }}>
            Monte fluxos automáticos e conecte WhatsApp ou Telegram.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate('/bot-builder/new')}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          + Novo fluxo
        </button>
      </div>

      {flows.length === 0 ? (
        <div style={{ background: '#FFFFFF', boxShadow: 'var(--shadow-sm)', padding: '3rem', textAlign: 'center', borderRadius: 14, border: `1px dashed ${B.border}` }}>
          <p style={{ color: B.muted, marginBottom: '1.5rem' }}>
            Nenhum fluxo criado. Comece criando um bot WhatsApp ou Telegram com mensagens automáticas.
          </p>
          <button type="button" className="btn-primary" onClick={() => navigate('/bot-builder/new')}>
            Criar primeiro fluxo
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {flows.map((flow) => (
            <div
              key={flow.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/bot-builder/${flow.id}`)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/bot-builder/${flow.id}`)}
              style={{
                background: '#FFFFFF',
                boxShadow: 'var(--shadow-sm)',
                padding: '1.25rem',
                borderRadius: 14,
                border: `1px solid ${B.border}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <span style={{ fontSize: 11, color: B.lime, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {getBotChannelLabel(flow.channel)}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, flow)}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12 }}
                >
                  Excluir
                </button>
              </div>
              <h3 style={{ color: B.text, margin: '8px 0', fontSize: '1.1rem' }}>{flow.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: B.muted }}>
                <span style={{ color: flow.isActive ? B.lime : B.muted }}>
                  {flow.isActive ? 'Ativo' : 'Inativo'}
                </span>
                <span>{flow.nodeCount} {flow.nodeCount === 1 ? 'nó' : 'nós'}</span>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: B.lime }}>Conectar / testar →</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
