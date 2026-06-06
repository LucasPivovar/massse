import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BOT_CHANNELS, createBotFlow } from '../lib/botFlowApi';

export default function BotCreateFlow() {
  const navigate = useNavigate();
  const [channel, setChannel] = useState('whatsapp_qr');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Informe o nome do fluxo');
      return;
    }
    setSaving(true);
    try {
      const flow = await createBotFlow({ name: name.trim(), channel });
      if (!flow) {
        toast.error('Erro ao criar fluxo');
        return;
      }
      toast.success('Fluxo criado!');
      navigate(`/bot-builder/${flow.id}/edit`);
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: 520, margin: '0 auto' }}>
      <button type="button" className="btn-secondary" style={{ marginBottom: '1rem' }} onClick={() => navigate('/bot-builder')}>
        ← Voltar
      </button>
      <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: 8 }}>Novo fluxo</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Escolha WhatsApp (QR) ou Telegram e monte o fluxo visual de mensagens.
      </p>

      <div className="card-gradient" style={{ padding: '1.5rem', borderRadius: 14 }}>
        {BOT_CHANNELS.map((opt) => (
          <label
            key={opt.id}
            style={{
              display: 'block',
              padding: '12px 14px',
              marginBottom: 8,
              border: `1px solid ${channel === opt.id ? 'rgba(168, 85, 247,0.4)' : 'rgba(168, 85, 247,0.1)'}`,
              borderRadius: 10,
              cursor: opt.disabled ? 'not-allowed' : 'pointer',
              opacity: opt.disabled ? 0.55 : 1,
            }}
          >
            <input
              type="radio"
              name="channel"
              value={opt.id}
              checked={channel === opt.id}
              disabled={opt.disabled}
              onChange={() => !opt.disabled && setChannel(opt.id)}
              style={{ marginRight: 10 }}
            />
            <strong style={{ color: 'var(--text-primary)' }}>{opt.label}</strong>
            <p style={{ margin: '4px 0 0 24px', fontSize: 12, color: 'var(--text-secondary)' }}>{opt.description}</p>
          </label>
        ))}

        <div style={{ marginTop: 20 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>Nome do fluxo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Atendimento automático"
            maxLength={150}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'transparent',
              border: 'none',
              borderRadius: 8,
              color: 'var(--text-primary)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="button"
          className="btn-primary"
          style={{ width: '100%', marginTop: 20 }}
          disabled={saving || !name.trim()}
          onClick={handleCreate}
        >
          {saving ? 'Criando...' : 'Criar e editar fluxo'}
        </button>
      </div>
    </div>
  );
}
