import { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export const PollNode = memo(({ id, data, selected }) => {
  const { updateNodeData, setNodes, setEdges } = useReactFlow();
  const [newOptionText, setNewOptionText] = useState('');

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  const handleAddOption = () => {
    if (!newOptionText.trim()) return;
    const currentOptions = data.options || [];
    if (currentOptions.length >= 10) return; // Telegram limit
    updateNodeData(id, { options: [...currentOptions, newOptionText.trim()] });
    setNewOptionText('');
  };

  const handleRemoveOption = (index) => {
    const currentOptions = data.options || [];
    updateNodeData(id, {
      options: currentOptions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bot-node" style={{ border: '2px solid #8b5cf6', boxShadow: selected ? '0 0 0 2px #E5E7EB, 0 0 0 4px #8b5cf6' : 'none', transition: 'box-shadow 0.2s' }}>
      <div className="bot-node-header" style={{ background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Enquete</span>
        <button onClick={handleDelete} title="Excluir nó" className="nodrag" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 4px', fontSize: 14 }}>
          ✕
        </button>
      </div>
      <div className="bot-node-body nodrag">
        <div className="field">
          <label htmlFor={`msg-${id}`}>Pergunta</label>
          <textarea
            id={`msg-${id}`}
            rows={2}
            placeholder="Ex: Qual sua cor favorita?"
            value={data.question || ''}
            onChange={(e) => updateNodeData(id, { question: e.target.value })}
          />
        </div>
        
        <div className="field">
          <label>Opções (mín. 2, máx. 10)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
            {(data.options || []).map((optText, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', background: '#374151', padding: '4px 8px', borderRadius: 4, justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#e5e5e5' }}>{optText}</span>
                <button type="button" onClick={() => handleRemoveOption(i)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 4px' }}>✕</button>
              </div>
            ))}
          </div>
          
          {(data.options || []).length < 10 && (
            <div style={{ display: 'flex', gap: 4 }}>
              <input
                type="text"
                placeholder="Nova opção..."
                value={newOptionText}
                onChange={(e) => setNewOptionText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
                style={{ flex: 1, padding: '4px 8px', fontSize: 12 }}
              />
              <button type="button" onClick={handleAddOption} className="btn-primary" style={{ padding: '4px 8px', fontSize: 12 }}>
                Add
              </button>
            </div>
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#8b5cf6' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#8b5cf6' }} />
    </div>
  );
});
PollNode.displayName = 'PollNode';
