import { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

const PRESET_COLORS = [
  { name: 'Roxo', border: '#a855f7', bg: 'rgba(168, 85, 247, 0.2)' },
  { name: 'Azul', border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)' },
  { name: 'Verde', border: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' },
  { name: 'Vermelho', border: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)' },
  { name: 'Laranja', border: '#f97316', bg: 'rgba(249, 115, 22, 0.2)' },
  { name: 'Amarelo', border: '#eab308', bg: 'rgba(234, 179, 8, 0.2)' },
  { name: 'Cinza', border: '#9ca3af', bg: 'rgba(156, 163, 175, 0.2)' },
];

export const ShapeNode = memo(({ id, data, selected }) => {
  const { updateNodeData, setNodes, setEdges } = useReactFlow();

  const shapeType = data.shapeType || 'square'; // circle, square, rectangle
  const label = data.label || 'Texto';
  const bgColor = data.bgColor || 'rgba(168, 85, 247, 0.2)';
  const borderColor = data.borderColor || '#a855f7';
  const textColor = data.textColor || '#ffffff';
  const borderStyle = data.borderStyle || 'solid'; // solid, dashed
  const fontSize = data.fontSize || '14px';

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  // Dimensions based on shape type
  let shapeStyle = {
    background: bgColor,
    border: `2px ${borderStyle} ${borderColor}`,
    color: textColor,
    fontSize: fontSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '12px',
    boxSizing: 'border-box',
    width: '140px',
    height: '140px',
    transition: 'all 0.22s ease',
    position: 'relative',
    cursor: 'move',
    boxShadow: selected ? `0 0 0 2px #E5E7EB, 0 8px 30px rgba(0, 0, 0, 0.5)` : '0 4px 15px rgba(0, 0, 0, 0.3)',
  };

  if (shapeType === 'circle') {
    shapeStyle.borderRadius = '50%';
  } else if (shapeType === 'square') {
    shapeStyle.borderRadius = '12px';
  } else if (shapeType === 'rectangle') {
    shapeStyle.borderRadius = '12px';
    shapeStyle.width = '200px';
    shapeStyle.height = '100px';
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Editor Panel - Visible ONLY when selected */}
      {selected && (
        <div
          className="nodrag"
          style={{
            position: 'absolute',
            bottom: '105%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(10, 16, 6, 0.98)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '10px',
            padding: '10px',
            width: '240px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
            zIndex: 1000,
            fontSize: '11px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px' }}>
            <span style={{ fontWeight: '700', color: '#d8b4fe' }}>Configurar Forma</span>
            <button
              onClick={handleDelete}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '2px 4px',
              }}
              title="Excluir"
            >
              ✕ Excluir
            </button>
          </div>

          {/* Shape type selector */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {['circle', 'square', 'rectangle'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateNodeData(id, { shapeType: type })}
                style={{
                  flex: 1,
                  padding: '4px',
                  background: shapeType === type ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(168, 85, 247, 0.15)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '9px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {type === 'circle' ? 'Círculo' : type === 'square' ? 'Quadrado' : 'Retângulo'}
              </button>
            ))}
          </div>

          {/* Color presets selector */}
          <div>
            <span style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Cor de Fundo / Borda</span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => updateNodeData(id, { bgColor: color.bg, borderColor: color.border })}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: color.bg,
                    border: `1.5px solid ${color.border}`,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Text controls */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <span style={{ color: '#9ca3af', display: 'block', marginBottom: '2px' }}>Texto</span>
              <input
                type="text"
                value={label}
                onChange={(e) => updateNodeData(id, { label: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  color: '#fff',
                  padding: '4px 6px',
                  fontSize: '11px',
                }}
              />
            </div>
            <div style={{ width: '60px' }}>
              <span style={{ color: '#9ca3af', display: 'block', marginBottom: '2px' }}>Tamanho</span>
              <select
                value={fontSize}
                onChange={(e) => updateNodeData(id, { fontSize: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  color: '#fff',
                  padding: '3px 4px',
                  fontSize: '11px',
                }}
              >
                <option value="11px">P</option>
                <option value="14px">M</option>
                <option value="18px">G</option>
                <option value="24px">GG</option>
              </select>
            </div>
          </div>

          {/* Border style controls */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9ca3af', cursor: 'pointer' }}>
              <input
                type="radio"
                name={`border-style-${id}`}
                checked={borderStyle === 'solid'}
                onChange={() => updateNodeData(id, { borderStyle: 'solid' })}
              />
              Borda contínua
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9ca3af', cursor: 'pointer' }}>
              <input
                type="radio"
                name={`border-style-${id}`}
                checked={borderStyle === 'dashed'}
                onChange={() => updateNodeData(id, { borderStyle: 'dashed' })}
              />
              Tracejada
            </label>
          </div>
        </div>
      )}

      {/* Actual Shape Container */}
      <div style={shapeStyle}>
        <div style={{ padding: '8px', wordBreak: 'break-word', width: '100%', maxHeight: '100%', overflow: 'hidden' }}>
          {label}
        </div>
        
        {/* Discreet Handles */}
        <Handle 
          type="target" 
          position={Position.Top} 
          style={{ background: borderColor, width: '8px', height: '8px', border: '1px solid #ffffff' }} 
        />
        <Handle 
          type="source" 
          position={Position.Bottom} 
          style={{ background: borderColor, width: '8px', height: '8px', border: '1px solid #ffffff' }} 
        />
      </div>
    </div>
  );
});

ShapeNode.displayName = 'ShapeNode';
