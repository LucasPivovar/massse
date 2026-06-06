import React, { useState } from 'react';

const NODE_ITEMS = [
  { type: 'contextNode', label: 'Contextualização', color: '#8b5cf6' },
  { type: 'messageNode', label: 'Mensagem (roteiro)', color: '#3b82f6' },
  { type: 'conditionNode', label: 'Condicional', color: '#a855f7' },
  { type: 'imageNode', label: 'Imagem', color: '#22c55e' },
  { type: 'buttonNode', label: 'Botões', color: '#0ea5e9' },
  { type: 'pollNode', label: 'Enquete', color: '#8b5cf6' },
  { type: 'delayNode', label: 'Delay', color: '#f97316' },
];

export default function BotBuilderSidebar({ onAddNode }) {
  const [autoConnect, setAutoConnect] = useState(true);
  const [conditionHandle, setConditionHandle] = useState('true');

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow-autoconnect', String(autoConnect));
    event.dataTransfer.setData('application/reactflow-conditionhandle', conditionHandle);
  };

  return (
    <aside className="bot-builder-sidebar">
      <h3 style={{ fontSize: 14, margin: '0 0 12px', color: '#e5e5e5' }}>Nós do fluxo</h3>
      <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>
        Clique ou arraste para o canvas
      </p>

      {NODE_ITEMS.map((item) => (
        <div
          key={item.type}
          className="bot-sidebar-item"
          draggable
          onDragStart={(e) => onDragStart(e, item.type)}
          onClick={() => onAddNode?.(item.type, { enabled: autoConnect, conditionHandle })}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
          {item.label}
        </div>
      ))}

      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(168, 85, 247,0.1)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#9ca3af', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={autoConnect}
            onChange={(e) => setAutoConnect(e.target.checked)}
          />
          Conectar ao nó selecionado
        </label>
        {autoConnect && (
          <div style={{ marginTop: 8 }}>
            <label style={{ fontSize: 11, color: '#6b7280' }}>Saída condicional</label>
            <select
              value={conditionHandle}
              onChange={(e) => setConditionHandle(e.target.value)}
              style={{ marginTop: 4, width: '100%' }}
            >
              <option value="true">Verdadeiro (V)</option>
              <option value="false">Falso (F)</option>
            </select>
          </div>
        )}
      </div>
    </aside>
  );
}
