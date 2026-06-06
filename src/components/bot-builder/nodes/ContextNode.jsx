import { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
export const ContextNode = memo(({ id, data, selected }) => {
  const { updateNodeData, setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  return (
    <div className="bot-node" style={{ border: '2px solid #8b5cf6', boxShadow: selected ? '0 0 0 2px #E5E7EB, 0 0 0 4px #8b5cf6' : 'none', transition: 'box-shadow 0.2s' }}>
      <div className="bot-node-header" style={{ background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Contextualização</span>
        <button onClick={handleDelete} title="Excluir nó" className="nodrag" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 4px', fontSize: 14 }}>
          ✕
        </button>
      </div>
      <div className="bot-node-body nodrag">
        <div className="field">
          <label htmlFor={`ctx-${id}`}>Instruções gerais para a IA</label>
          <textarea
            id={`ctx-${id}`}
            rows={4}
            placeholder="Ex: Você é assistente da loja X..."
            value={data.context || ''}
            onChange={(e) => updateNodeData(id, { context: e.target.value })}
          />
        </div>
        <p style={{ fontSize: 10, color: '#6b7280', margin: 0 }}>
          Não envia mensagem. Define o comportamento do bot.
        </p>
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#8b5cf6' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#8b5cf6' }} />
    </div>
  );
});
ContextNode.displayName = 'ContextNode';
