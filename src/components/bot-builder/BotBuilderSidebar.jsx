import React, { useState } from 'react';

const ACTIONS_ITEMS = [
  { type: 'messageNode', label: 'Mensagem (roteiro)', color: '#3b82f6' },
  { type: 'buttonNode', label: 'Botões', color: '#0ea5e9' },
  { type: 'pollNode', label: 'Enquete', color: '#8b5cf6' },
  { type: 'imageNode', label: 'Imagem', color: '#22c55e' },
  { type: 'emailNode', label: 'Enviar E-mail', color: '#ec4899' },
  { type: 'delayNode', label: 'Delay', color: '#f97316' },
];

const LOGIC_ITEMS = [
  { type: 'conditionNode', label: 'Condicional', color: '#a855f7' },
  { type: 'contextNode', label: 'Contextualização', color: '#8b5cf6' },
];

const SHAPE_ITEMS = [
  { type: 'shapeNode', shapeType: 'circle', label: 'Círculo', color: '#d8b4fe', icon: '○' },
  { type: 'shapeNode', shapeType: 'square', label: 'Quadrado', color: '#c084fc', icon: '□' },
  { type: 'shapeNode', shapeType: 'rectangle', label: 'Retângulo', color: '#a855f7', icon: '▭' },
];

export default function BotBuilderSidebar({ onAddNode }) {
  const [autoConnect, setAutoConnect] = useState(true);
  const [conditionHandle, setConditionHandle] = useState('true');

  const onDragStart = (event, nodeType, shapeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow-autoconnect', String(autoConnect));
    event.dataTransfer.setData('application/reactflow-conditionhandle', conditionHandle);
    if (shapeType) {
      event.dataTransfer.setData('application/reactflow-shapetype', shapeType);
    }
  };

  const renderItem = (item) => (
    <div
      key={item.shapeType ? `${item.type}-${item.shapeType}` : item.type}
      className="bot-sidebar-item"
      draggable
      onDragStart={(e) => onDragStart(e, item.type, item.shapeType)}
      onClick={() => onAddNode?.(item.type, { enabled: autoConnect, conditionHandle, shapeType: item.shapeType })}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        border: '1px solid rgba(168, 85, 247, 0.12)',
        borderRadius: '8px',
        marginBottom: '8px',
        cursor: 'grab',
        fontSize: '13px',
        background: 'rgba(255, 255, 255, 0.02)',
        transition: 'all 0.15s ease',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(168, 85, 247, 0.05)';
        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.12)';
      }}
    >
      {item.icon ? (
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: item.color, width: '16px', display: 'inline-flex', justifyContent: 'center' }}>
          {item.icon}
        </span>
      ) : (
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
      )}
      <span style={{ color: '#e5e5e5' }}>{item.label}</span>
    </div>
  );

  return (
    <aside className="bot-builder-sidebar">
      <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 4px 0', color: '#e5e5e5' }}>Ferramentas</h3>
      <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '20px' }}>
        Clique ou arraste os nós para o sandbox
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Actions Category */}
        <div>
          <h4 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', margin: '0 0 10px 0' }}>
            Ações
          </h4>
          <div>{ACTIONS_ITEMS.map(renderItem)}</div>
        </div>

        {/* Logic Category */}
        <div>
          <h4 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', margin: '0 0 10px 0' }}>
            Lógica
          </h4>
          <div>{LOGIC_ITEMS.map(renderItem)}</div>
        </div>

        {/* Shapes Category */}
        <div>
          <h4 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', margin: '0 0 10px 0' }}>
            Formas & Anotações
          </h4>
          <div>{SHAPE_ITEMS.map(renderItem)}</div>
        </div>
      </div>

      {/* Auto-connect options */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(168, 85, 247, 0.15)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9ca3af', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={autoConnect}
            onChange={(e) => setAutoConnect(e.target.checked)}
            style={{ accentColor: 'var(--accent-primary)' }}
          />
          Autoconectar ao nó selecionado
        </label>
        
        {autoConnect && (
          <div style={{ marginTop: '10px' }}>
            <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Saída condicional padrão
            </label>
            <select
              value={conditionHandle}
              onChange={(e) => setConditionHandle(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '6px',
                color: '#e5e5e5',
                fontSize: '12px',
                outline: 'none',
              }}
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
