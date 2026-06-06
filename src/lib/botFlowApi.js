const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  const res = await fetch(`${API_BASE}/api/bot-flows`, { headers: authHeaders() });
  const { ok, data } = await parseResponse(res);
  return ok && Array.isArray(data) ? data : [];
}

export async function fetchBotFlowById(id) {
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
  const res = await fetch(`${API_BASE}/api/bot-flows/${id}/save`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return res.ok;
}

export async function updateBotFlowMeta(id, payload) {
  const res = await fetch(`${API_BASE}/api/bot-flows/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return res.ok;
}

export async function deleteBotFlow(id) {
  const res = await fetch(`${API_BASE}/api/bot-flows/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return res.ok;
}

export async function fetchTelegramConnectionStatus(flowId) {
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/telegram/status`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const { ok, data } = await parseResponse(res);
  return ok ? data : null;
}

export async function connectTelegramBot(flowId, botToken) {
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
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/telegram/disconnect`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return res.ok;
}

export async function fetchTelegramDiagnostics(flowId) {
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/telegram/diagnostics`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const { ok, data } = await parseResponse(res);
  return ok ? data : null;
}

export async function reregisterTelegramWebhook(flowId) {
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
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/whatsapp/status`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const { ok, data } = await parseResponse(res);
  return ok ? data : null;
}

export async function connectWhatsappBot(flowId) {
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
