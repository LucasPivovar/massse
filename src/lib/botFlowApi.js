const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const mockFlowsList = [
  { 
    id: 'mock1', 
    name: 'Qualificação de Leads', 
    channel: 'whatsapp_qr', 
    isActive: true, 
    nodeCount: 5,
    nodes: [
      {
        id: 'node_1',
        type: 'contextNode',
        position: { x: 250, y: 50 },
        data: { context: 'Você é a assistente virtual da MassFlow. Seja amigável, prestativa e objetiva. Ajude o lead a entender como nossa plataforma de disparos em massa pode alavancar suas vendas.' }
      },
      {
        id: 'node_2',
        type: 'messageNode',
        position: { x: 250, y: 250 },
        data: { useAi: true, message: 'Olá! Sou a assistente virtual da MassFlow. 😊\nComo posso ajudar você hoje? Qual é o seu nome e qual o seu negócio?' }
      },
      {
        id: 'node_3',
        type: 'conditionNode',
        position: { x: 250, y: 480 },
        data: { conditionType: 'contains', conditionValue: 'disparo' }
      },
      {
        id: 'node_4',
        type: 'messageNode',
        position: { x: 50, y: 680 },
        data: { useAi: false, message: 'Perfeito! Se você precisa de disparos automáticos e em massa no WhatsApp, a MassFlow é a escolha ideal. Nós oferecemos suporte a envios instantâneos, relatórios de entrega e construtor de fluxos como este!' }
      },
      {
        id: 'node_5',
        type: 'messageNode',
        position: { x: 450, y: 680 },
        data: { useAi: true, message: 'Entendi! Nós também oferecemos suporte completo para atendimento e automações inteligentes. Posso agendar uma demonstração gratuita com um especialista?' }
      }
    ],
    edges: [
      { id: 'e-node_1-node_2', source: 'node_1', target: 'node_2', animated: true },
      { id: 'e-node_2-node_3', source: 'node_2', target: 'node_3', animated: true },
      { id: 'e-node_3-node_4', source: 'node_3', target: 'node_4', sourceHandle: 'true', animated: true },
      { id: 'e-node_3-node_5', source: 'node_3', target: 'node_5', sourceHandle: 'false', animated: true }
    ]
  },
  { 
    id: 'mock2', 
    name: 'Carrinho Abandonado', 
    channel: 'whatsapp_qr', 
    isActive: true, 
    nodeCount: 4,
    nodes: [
      {
        id: 'node_1',
        type: 'contextNode',
        position: { x: 250, y: 50 },
        data: { context: 'Você é um atendente da loja virtual Importados Premium. Ofereça um desconto exclusivo de 10% se o cliente concluir a compra.' }
      },
      {
        id: 'node_2',
        type: 'messageNode',
        position: { x: 250, y: 220 },
        data: { useAi: false, message: 'Olá! Vimos que você deixou alguns itens incríveis no seu carrinho. Deseja finalizar sua compra agora com um desconto exclusivo?' }
      },
      {
        id: 'node_3',
        type: 'buttonNode',
        position: { x: 250, y: 420 },
        data: { message: 'Escolha uma das opções abaixo para prosseguir:', buttons: ['Sim, quero o desconto!', 'Falar com suporte', 'Não tenho interesse'] }
      },
      {
        id: 'node_4',
        type: 'messageNode',
        position: { x: 250, y: 650 },
        data: { useAi: true, message: 'Maravilhoso! Use o cupom CLIENTEVIP10 na página de checkout para garantir seus 10% de desconto. Se precisar de ajuda, estou aqui!' }
      }
    ],
    edges: [
      { id: 'e-node_1-node_2', source: 'node_1', target: 'node_2', animated: true },
      { id: 'e-node_2-node_3', source: 'node_2', target: 'node_3', animated: true },
      { id: 'e-node_3-node_4', source: 'node_3', target: 'node_4', animated: true }
    ]
  },
  { 
    id: 'mock3', 
    name: 'FAQ Automático', 
    channel: 'telegram', 
    isActive: true, 
    nodeCount: 3,
    nodes: [
      {
        id: 'node_1',
        type: 'contextNode',
        position: { x: 250, y: 50 },
        data: { context: 'Você é o FAQ do suporte técnico da MassFlow. Responda dúvidas sobre integração de WhatsApp e taxas de envio.' }
      },
      {
        id: 'node_2',
        type: 'messageNode',
        position: { x: 250, y: 220 },
        data: { useAi: true, message: 'Olá! Sou o assistente de suporte da MassFlow. 🤖\nComo posso ajudar você hoje?' }
      },
      {
        id: 'node_3',
        type: 'pollNode',
        position: { x: 250, y: 420 },
        data: { question: 'Qual o principal assunto da sua dúvida?', options: ['Como conectar WhatsApp', 'Preços e Planos', 'Outros assuntos'] }
      }
    ],
    edges: [
      { id: 'e-node_1-node_2', source: 'node_1', target: 'node_2', animated: true },
      { id: 'e-node_2-node_3', source: 'node_2', target: 'node_3', animated: true }
    ]
  }
];

function isMockId(id) {
  return String(id).startsWith('mock');
}

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

function parseJsonField(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
}

function mapFlowDetail(raw) {
  return {
    id: raw.id,
    name: String(raw.name ?? 'Fluxo'),
    channel: raw.channel,
    nodes: parseJsonField(raw.nodes, []),
    edges: parseJsonField(raw.edges, []),
    isActive: raw.isActive === true || raw.isActive === 1,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

async function parseResponse(res) {
  const text = await res.text();
  if (!res.ok) return { ok: false, data: null, text };
  if (!text.trim()) return { ok: true, data: null, text };
  return { ok: true, data: JSON.parse(text), text };
}

export async function fetchBotFlows() {
  try {
    const res = await fetch(`${API_BASE}/api/bot-flows`, { headers: authHeaders() });
    const { ok, data } = await parseResponse(res);
    if (ok && Array.isArray(data)) {
      return [...data, ...mockFlowsList];
    }
    return mockFlowsList;
  } catch (err) {
    console.warn('Backend server connection failed, falling back to mock flows.');
    return mockFlowsList;
  }
}

export async function fetchBotFlowById(id) {
  if (isMockId(id)) {
    const found = mockFlowsList.find(f => f.id === id);
    return found ? mapFlowDetail(found) : null;
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const { ok, data } = await parseResponse(res);
  return ok && data ? mapFlowDetail(data) : null;
}

export async function createBotFlow(payload) {
  const res = await fetch(`${API_BASE}/api/bot-flows`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const { ok, data } = await parseResponse(res);
  return ok && data ? mapFlowDetail(data) : null;
}

export async function saveBotFlow(id, payload) {
  if (isMockId(id)) {
    const found = mockFlowsList.find(f => f.id === id);
    if (found) {
      if (payload.nodes) found.nodes = payload.nodes;
      if (payload.edges) found.edges = payload.edges;
      if (payload.isActive !== undefined) found.isActive = payload.isActive;
      found.nodeCount = payload.nodes ? payload.nodes.length : found.nodeCount;
    }
    return true;
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${id}/save`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return res.ok;
}

export async function updateBotFlowMeta(id, payload) {
  if (isMockId(id)) {
    const found = mockFlowsList.find(f => f.id === id);
    if (found) {
      Object.assign(found, payload);
    }
    return true;
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return res.ok;
}

export async function deleteBotFlow(id) {
  if (isMockId(id)) {
    const index = mockFlowsList.findIndex(f => f.id === id);
    if (index !== -1) mockFlowsList.splice(index, 1);
    return true;
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return res.ok;
}

export async function fetchTelegramConnectionStatus(flowId) {
  if (isMockId(flowId)) {
    const flow = mockFlowsList.find(f => f.id === flowId);
    return { connected: flow?.isActive || false, botUsername: flow?.isActive ? 'MockedTelegramBot' : null };
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/telegram/status`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const { ok, data } = await parseResponse(res);
  return ok ? data : null;
}

export async function connectTelegramBot(flowId, botToken) {
  if (isMockId(flowId)) {
    const flow = mockFlowsList.find(f => f.id === flowId);
    if (flow) flow.isActive = true;
    return { success: true, botUsername: 'MockedTelegramBot' };
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/telegram/connect`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ botToken }),
  });
  const { ok, data, text } = await parseResponse(res);
  if (!ok) {
    try {
      const err = JSON.parse(text);
      return { success: false, message: err.message || 'Erro ao conectar' };
    } catch {
      return { success: false, message: 'Erro ao conectar' };
    }
  }
  return data || { success: true };
}

export async function disconnectTelegramBot(flowId) {
  if (isMockId(flowId)) {
    const flow = mockFlowsList.find(f => f.id === flowId);
    if (flow) flow.isActive = false;
    return true;
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/telegram/disconnect`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return res.ok;
}

export async function fetchTelegramDiagnostics(flowId) {
  if (isMockId(flowId)) {
    return { baseUrlUsed: 'https://mock.massflow.com', expectedWebhookUrl: 'https://mock.massflow.com/webhook', issues: [] };
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/telegram/diagnostics`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const { ok, data } = await parseResponse(res);
  return ok ? data : null;
}

export async function reregisterTelegramWebhook(flowId) {
  if (isMockId(flowId)) {
    return { success: true };
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/telegram/reregister-webhook`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const { ok, data, text } = await parseResponse(res);
  if (!ok) {
    try {
      const err = JSON.parse(text);
      return { success: false, message: err.message };
    } catch {
      return { success: false, message: 'Erro ao re-registrar webhook' };
    }
  }
  return data || { success: true };
}

export async function fetchWhatsappConnectionStatus(flowId) {
  if (isMockId(flowId)) {
    const flow = mockFlowsList.find(f => f.id === flowId);
    const hasQrState = localStorage.getItem(`mock_qr_state_${flowId}`) === 'ready';
    return { 
      connected: flow?.isActive || false, 
      status: flow?.isActive ? 'connected' : (hasQrState ? 'qr_ready' : 'disconnected'),
      botPhoneNumber: flow?.isActive ? '5511999999999' : null,
      qrCode: hasQrState ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fff" stroke="%23A855F7" stroke-width="2"/><text x="50" y="45" font-family="sans-serif" font-weight="bold" font-size="6" text-anchor="middle" dominant-baseline="middle" fill="%23A855F7">WhatsApp QR Code</text><text x="50" y="55" font-family="sans-serif" font-size="4" text-anchor="middle" dominant-baseline="middle" fill="%236b7280">Escaneie para Conectar</text></svg>' : null
    };
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/whatsapp/status`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const { ok, data } = await parseResponse(res);
  return ok ? data : null;
}

export async function connectWhatsappBot(flowId) {
  if (isMockId(flowId)) {
    localStorage.setItem(`mock_qr_state_${flowId}`, 'ready');
    setTimeout(() => {
      const flow = mockFlowsList.find(f => f.id === flowId);
      if (flow) {
        flow.isActive = true;
        localStorage.removeItem(`mock_qr_state_${flowId}`);
      }
    }, 4000);
    return { success: true };
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/whatsapp/connect`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const { ok, data, text } = await parseResponse(res);
  if (!ok) {
    try {
      const err = JSON.parse(text);
      return { success: false, message: err.message || 'Erro ao conectar' };
    } catch {
      return { success: false, message: 'Erro ao conectar' };
    }
  }
  return data || { success: true };
}

export async function disconnectWhatsappBot(flowId) {
  if (isMockId(flowId)) {
    const flow = mockFlowsList.find(f => f.id === flowId);
    if (flow) flow.isActive = false;
    localStorage.removeItem(`mock_qr_state_${flowId}`);
    return true;
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/whatsapp/disconnect`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return res.ok;
}

export const BOT_CHANNELS = [
  {
    id: 'whatsapp_qr',
    label: 'WhatsApp — QR dinâmico',
    description: 'Conecte escaneando o QR Code no celular (WhatsApp Web).',
  },
  {
    id: 'whatsapp_api',
    label: 'WhatsApp — API oficial',
    description: 'Integração via Meta Business / Cloud API (em breve).',
    disabled: true,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    description: 'Bot via token do @BotFather com webhook automático.',
  },
];

export const BOT_CHANNEL_LABELS = {
  whatsapp_qr: 'WhatsApp QR',
  whatsapp_api: 'WhatsApp API',
  telegram: 'Telegram',
};

export function getBotChannelLabel(channel) {
  return BOT_CHANNEL_LABELS[channel] || channel;
}
