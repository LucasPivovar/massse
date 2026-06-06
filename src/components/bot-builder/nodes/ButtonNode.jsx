import { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export const ButtonNode = memo(({ id, data, selected }) => {
  const { updateNodeData, setNodes, setEdges } = useReactFlow();
  const [newButtonText, setNewButtonText] = useState('');

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  const handleAddButton = () => {
    if (!newButtonText.trim()) return;
    const currentButtons = data.buttons || [];
    updateNodeData(id, { buttons: [...currentButtons, newButtonText.trim()] });
    setNewButtonText('');
  };

  const handleRemoveButton = (index) => {
    const currentButtons = data.buttons || [];
    updateNodeData(id, {
      buttons: currentButtons.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bot-node" style={{ border: '2px solid #0ea5e9', boxShadow: selected ? '0 0 0 2px #E5E7EB, 0 0 0 4px #0ea5e9' : 'none', transition: 'box-shadow 0.2s' }}>
      <div className="bot-node-header" style={{ background: 'rgba(14,165,233,0.15)', color: '#7dd3fc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Botões</span>
        <button onClick={handleDelete} title="Excluir nó" className="nodrag" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 4px', fontSize: 14 }}>
          ✕
        </button>
      </div>
      <div className="bot-node-body nodrag">
        <div className="field">
          <label htmlFor={`msg-${id}`}>Mensagem principal</label>
          <textarea
            id={`msg-${id}`}
            rows={2}
            placeholder="Ex: Qual opção você deseja?"
            value={data.message || ''}
            onChange={(e) => updateNodeData(id, { message: e.target.value })}
          />
        </div>
        
        <div className="field">
          <label>Botões de Opção</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
            {(data.buttons || []).map((btnText, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', background: '#374151', padding: '4px 8px', borderRadius: 4, justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#e5e5e5' }}>{btnText}</span>
                <button type="button" onClick={() => handleRemoveButton(i)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 4px' }}>✕</button>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: 4 }}>
            <input
              type="text"
              placeholder="Novo botão..."
              value={newButtonText}
              onChange={(e) => setNewButtonText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddButton();
                }
              }}
              style={{ flex: 1, padding: '4px 8px', fontSize: 12 }}
            />
            <button type="button" onClick={handleAddButton} className="btn-primary" style={{ padding: '4px 8px', fontSize: 12 }}>
              Adicionar
            </button>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#0ea5e9' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#0ea5e9' }} />
    </div>
  );
});
ButtonNode.displayName = 'ButtonNode';
