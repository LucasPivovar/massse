import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  fetchBotFlowById,
  fetchTelegramConnectionStatus,
  fetchTelegramDiagnostics,
  reregisterTelegramWebhook,
  connectTelegramBot,
  disconnectTelegramBot,
  fetchWhatsappConnectionStatus,
  connectWhatsappBot,
  disconnectWhatsappBot,
  updateBotFlowMeta,
  getBotChannelLabel,
} from '../lib/botFlowApi';

const cardStyle = {
  padding: '1.5rem',
  borderRadius: 14,
  border: '1px solid rgba(168, 85, 247,0.09)',
  flex: 1,
  minWidth: 280,
};

const inputStyle = {
  width: '100%',
  marginTop: 6,
  marginBottom: 12,
  padding: '10px 12px',
  background: 'rgba(0,0,0,0.4)',
  border: '1px solid rgba(168, 85, 247,0.15)',
  borderRadius: 8,
  color: '#E5E5E5',
  boxSizing: 'border-box',
};

function TelegramConnectPanel({ flowId, onConnected }) {
  const [botToken, setBotToken] = useState('');
  const [status, setStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [diag, setDiag] = useState(null);
  const [loadingDiag, setLoadingDiag] = useState(false);
  const [reregistering, setReregistering] = useState(false);

  const loadStatus = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const data = await fetchTelegramConnectionStatus(flowId);
      setStatus(data);
    } catch {
      setStatus(null);
    } finally {
      setLoadingStatus(false);
    }
  }, [flowId]);

  const loadDiagnostics = useCallback(async () => {
    setLoadingDiag(true);
    try {
      const data = await fetchTelegramDiagnostics(flowId);
      setDiag(data);
    } catch {
      setDiag(null);
    } finally {
      setLoadingDiag(false);
    }
  }, [flowId]);

  useEffect(() => {
    loadStatus();
    loadDiagnostics();
  }, [loadStatus, loadDiagnostics]);

  const handleConnect = async () => {
    const token = botToken.trim();
    if (!token) {
      toast.error('Cole o token do @BotFather');
      return;
    }
    setConnecting(true);
    try {
      const result = await connectTelegramBot(flowId, token);
      if (!result.success) {
        toast.error(result.message || 'Erro ao conectar');
        return;
      }
      toast.success(
        result.botUsername ? `Bot @${result.botUsername} conectado!` : 'Bot conectado!',
      );
      setBotToken('');
      onConnected?.();
      await loadStatus();
      await loadDiagnostics();
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const ok = await disconnectTelegramBot(flowId);
      if (!ok) toast.error('Erro ao desconectar');
      else {
        toast.success('Bot desconectado');
        await loadStatus();
        await loadDiagnostics();
      }
    } finally {
      setDisconnecting(false);
    }
  };

  const handleReregisterWebhook = async () => {
    setReregistering(true);
    try {
      const result = await reregisterTelegramWebhook(flowId);
      if (!result.success) {
        toast.error(result.message || 'Falha ao re-registrar');
        return;
      }
      toast.success('Webhook re-registrado no Telegram');
      await loadDiagnostics();
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setReregistering(false);
    }
  };

  const connected = status?.connected === true;

  return (
    <>
      <div className="card-gradient" style={cardStyle}>
        <h3 style={{ color: '#E5E5E5', marginTop: 0 }}>Conectar Telegram</h3>
        <p style={{ fontSize: 13, color: '#9CA3AF' }}>
          Cole o token do @BotFather. O servidor precisa de BASE_URL em HTTPS público para receber mensagens.
        </p>

        {loadingStatus ? (
          <p style={{ color: '#9CA3AF' }}>Verificando conexão...</p>
        ) : connected ? (
          <div>
            <div style={{ padding: 12, background: 'rgba(34,197,94,0.1)', borderRadius: 8, marginBottom: 12 }}>
              <strong style={{ color: '#86efac' }}>Conectado</strong>
              {status?.botUsername && (
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9CA3AF' }}>@{status.botUsername}</p>
              )}
              <p style={{ fontSize: 11, color: '#6b7280', marginTop: 8 }}>
                Envie /start no Telegram para reiniciar o fluxo.
              </p>
            </div>
            <button type="button" className="btn-secondary" disabled={disconnecting} onClick={handleDisconnect}>
              {disconnecting ? 'Desconectando...' : 'Desconectar bot'}
            </button>
          </div>
        ) : (
          <div>
            <label style={{ fontSize: 12, color: '#9CA3AF' }}>Token do BotFather</label>
            <input
              type="password"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="123456789:AAH..."
              autoComplete="off"
              style={inputStyle}
            />
            <button type="button" className="btn-primary" style={{ width: '100%' }} disabled={connecting} onClick={handleConnect}>
              {connecting ? 'Conectando...' : 'Conectar bot Telegram'}
            </button>
          </div>
        )}
      </div>

      <div className="card-gradient" style={cardStyle}>
        <h3 style={{ color: '#E5E5E5', marginTop: 0 }}>Como testar</h3>
        <ol style={{ color: '#9CA3AF', fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Crie o bot no @BotFather e copie o token</li>
          <li>Cole o token e clique em Conectar</li>
          <li>Monte o fluxo no editor</li>
          <li>Ative o fluxo e envie /start no bot</li>
        </ol>
      </div>

      {connected && (
        <div className="card-gradient" style={{ ...cardStyle, marginTop: 20, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
            <h3 style={{ color: '#E5E5E5', margin: 0 }}>Diagnóstico</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn-secondary" disabled={loadingDiag} onClick={loadDiagnostics}>
                {loadingDiag ? 'Verificando...' : 'Atualizar'}
              </button>
              <button type="button" className="btn-primary" disabled={reregistering} onClick={handleReregisterWebhook}>
                {reregistering ? 'Registrando...' : 'Re-registrar webhook'}
              </button>
            </div>
          </div>
          {loadingDiag && !diag ? (
            <p style={{ color: '#9CA3AF' }}>Carregando diagnóstico...</p>
          ) : diag ? (
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>
              <p><strong style={{ color: '#E5E5E5' }}>BASE_URL:</strong> {diag.baseUrlUsed}</p>
              <p><strong style={{ color: '#E5E5E5' }}>Webhook esperado:</strong>{' '}
                <span style={{ wordBreak: 'break-all' }}>{diag.expectedWebhookUrl}</span>
              </p>
              {diag.issues?.length > 0 ? (
                <ul style={{ color: '#fbbf24', paddingLeft: 20, marginTop: 12 }}>
                  {diag.issues.map((issue) => (
                    <li key={issue} style={{ marginBottom: 6 }}>{issue}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#86efac', marginTop: 12 }}>Nenhum problema detectado.</p>
              )}
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}

function WhatsappConnectPanel({ flowId, flowName, onConnected }) {
  const [status, setStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      const data = await fetchWhatsappConnectionStatus(flowId);
      setStatus(data);
    } catch {
      setStatus(null);
    } finally {
      setLoadingStatus(false);
    }
  }, [flowId]);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 3000);
    return () => clearInterval(interval);
  }, [loadStatus]);

  useEffect(() => {
    if (status?.connected) onConnected?.();
  }, [status?.connected, onConnected]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const result = await connectWhatsappBot(flowId);
      if (!result.success) {
        toast.error(result.message || 'Erro ao iniciar conexão');
        return;
      }
      toast.success('Iniciando WhatsApp, aguarde o QR Code...');
      await loadStatus();
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const ok = await disconnectWhatsappBot(flowId);
      if (!ok) toast.error('Erro ao desconectar');
      else {
        toast.success('WhatsApp desconectado');
        await loadStatus();
      }
    } finally {
      setDisconnecting(false);
    }
  };

  const isConnected = status?.connected === true;
  const isQrReady = status?.status === 'qr_ready';
  const isConnecting = status?.status === 'connecting';

  if (loadingStatus && !status) {
    return (
      <div className="card-gradient" style={{ ...cardStyle, textAlign: 'center' }}>
        <p style={{ color: '#9CA3AF' }}>Verificando conexão WhatsApp...</p>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="card-gradient" style={cardStyle}>
        <div style={{ padding: 12, background: 'rgba(34,197,94,0.1)', borderRadius: 8, marginBottom: 12 }}>
          <strong style={{ color: '#86efac' }}>WhatsApp conectado</strong>
          {status?.botPhoneNumber && (
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9CA3AF' }}>
              Número: +{status.botPhoneNumber}
            </p>
          )}
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 8 }}>
            O bot responde às mensagens recebidas neste número.
          </p>
        </div>
        <button type="button" className="btn-secondary" style={{ width: '100%' }} disabled={disconnecting} onClick={handleDisconnect}>
          {disconnecting ? 'Desconectando...' : 'Desconectar WhatsApp'}
        </button>
      </div>
    );
  }

  return (
    <div className="card-gradient" style={{ ...cardStyle, textAlign: 'center' }}>
      <h3 style={{ color: '#E5E5E5', marginTop: 0 }}>WhatsApp — QR dinâmico</h3>
      <p style={{ fontSize: 13, color: '#9CA3AF' }}>
        Abra o WhatsApp no celular, vá em Aparelhos conectados e escaneie o código para o fluxo &quot;{flowName}&quot;.
      </p>

      {isConnecting ? (
        <div
          style={{
            height: 192,
            borderRadius: 12,
            border: '2px dashed rgba(168, 85, 247,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '16px 0',
          }}
        >
          <p style={{ color: '#9CA3AF', fontSize: 13 }}>Gerando QR Code...</p>
        </div>
      ) : isQrReady && status?.qrCode ? (
        <div style={{ background: '#fff', padding: 16, borderRadius: 12, display: 'inline-block', margin: '16px 0' }}>
          <img src={status.qrCode} alt="WhatsApp QR Code" width={192} height={192} />
        </div>
      ) : (
        <div
          style={{
            height: 192,
            borderRadius: 12,
            border: '2px dashed rgba(168, 85, 247,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '16px 0',
            color: '#6b7280',
            fontSize: 13,
          }}
        >
          Clique abaixo para gerar o QR Code
        </div>
      )}

      {isQrReady || isConnecting ? (
        <button type="button" className="btn-secondary" style={{ width: '100%' }} disabled={disconnecting} onClick={handleDisconnect}>
          Cancelar
        </button>
      ) : (
        <button type="button" className="btn-primary" style={{ width: '100%' }} disabled={connecting} onClick={handleConnect}>
          {connecting ? 'Iniciando...' : 'Gerar QR Code'}
        </button>
      )}

      <p style={{ fontSize: 11, color: '#6b7280', marginTop: 16, textAlign: 'left' }}>
        Envie /start no chat para reiniciar o fluxo. Logs do servidor: prefixo <code>[BotWhatsapp]</code>.
      </p>
    </div>
  );
}

function ConnectPanel({ channel, flowId, flowName, onConnected }) {
  if (channel === 'whatsapp_qr') {
    return <WhatsappConnectPanel flowId={flowId} flowName={flowName} onConnected={onConnected} />;
  }
  if (channel === 'whatsapp_api') {
    return (
      <div className="card-gradient" style={cardStyle}>
        <h3 style={{ color: '#E5E5E5', marginTop: 0 }}>WhatsApp — API oficial</h3>
        <p style={{ fontSize: 13, color: '#9CA3AF' }}>
          Integração via Meta Business (Phone Number ID, Access Token e Webhook) em breve.
        </p>
        <button type="button" className="btn-secondary" style={{ width: '100%' }} onClick={() => toast('Integração Meta em breve')}>
          Conectar conta Meta Business
        </button>
      </div>
    );
  }
  if (channel === 'telegram') {
    return <TelegramConnectPanel flowId={flowId} onConnected={onConnected} />;
  }
  return (
    <div className="card-gradient" style={cardStyle}>
      <p style={{ color: '#9CA3AF' }}>Canal não configurado.</p>
    </div>
  );
}

export default function BotFlowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [flow, setFlow] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchBotFlowById(Number(id));
      setFlow(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleToggleActive = async (e) => {
    const active = e.target.checked;
    const ok = await updateBotFlowMeta(flow.id, { isActive: active });
    if (!ok) {
      toast.error('Erro ao atualizar status');
      return;
    }
    setFlow({ ...flow, isActive: active });
    toast.success(active ? 'Fluxo ativado' : 'Fluxo desativado');
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: '#9CA3AF', textAlign: 'center' }}>Carregando...</div>;
  }

  if (!flow) {
    return (
      <div style={{ padding: '2rem' }}>
        <p style={{ color: '#9CA3AF' }}>Fluxo não encontrado.</p>
        <button type="button" className="btn-secondary" onClick={() => navigate('/bot-builder')}>
          Voltar
        </button>
      </div>
    );
  }

  const channelLabel = getBotChannelLabel(flow.channel);
  const activeLabel =
    flow.channel === 'whatsapp_qr'
      ? 'Fluxo ativo (bot responde no WhatsApp)'
      : flow.channel === 'telegram'
        ? 'Fluxo ativo (bot responde no Telegram)'
        : 'Fluxo ativo';

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1000, margin: '0 auto' }}>
      <button type="button" className="btn-secondary" style={{ marginBottom: '1rem' }} onClick={() => navigate('/bot-builder')}>
        ← Meus fluxos
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: '#E5E5E5', margin: 0 }}>{flow.name}</h1>
          <p style={{ color: '#9CA3AF', marginTop: 4 }}>{channelLabel}</p>
          {flow.channel !== 'whatsapp_api' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: '#E5E5E5', fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={flow.isActive} onChange={handleToggleActive} />
              {activeLabel}
            </label>
          )}
        </div>
        <button type="button" className="btn-secondary" onClick={() => navigate(`/bot-builder/${flow.id}/edit`)}>
          Editar fluxo
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <ConnectPanel
          channel={flow.channel}
          flowId={flow.id}
          flowName={flow.name}
          onConnected={() => setFlow({ ...flow, isActive: true })}
        />
      </div>
    </div>
  );
}
