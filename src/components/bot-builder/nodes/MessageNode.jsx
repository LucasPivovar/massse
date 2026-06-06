import { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export const MessageNode = memo(({ id, data, selected }) => {
  const { updateNodeData, setNodes, setEdges } = useReactFlow();
  const useAi = data?.useAi !== false;

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  return (
    <div className="bot-node" style={{ border: '2px solid #3b82f6', boxShadow: selected ? '0 0 0 2px #E5E7EB, 0 0 0 4px #3b82f6' : 'none', transition: 'box-shadow 0.2s' }}>
      <div className="bot-node-header" style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Mensagem (roteiro)</span>
        <button onClick={handleDelete} title="Excluir nó" className="nodrag" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 4px', fontSize: 14 }}>
          ✕
        </button>
      </div>
      <div className="bot-node-body nodrag">
        <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            id={`ai-${id}`}
            checked={useAi}
            onChange={(e) => updateNodeData(id, { useAi: e.target.checked })}
          />
          <label htmlFor={`ai-${id}`} style={{ margin: 0, cursor: 'pointer', fontSize: 12 }}>
            Responder com Gemini (recomendado)
          </label>
        </div>
        <div className="field">
          <label htmlFor={`msg-${id}`}>
            Roteiro desta etapa
          </label>
          <textarea
            id={`msg-${id}`}
            rows={4}
            placeholder="Ex: Apresente-se e pergunte o nome do cliente. Se ele já disse o nome, cumprimente pelo nome."
            value={data?.message || ''}
            onChange={(e) => updateNodeData(id, { message: e.target.value })}
          />
        </div>
        <p style={{ fontSize: 10, color: '#6b7280', margin: 0, lineHeight: 1.4 }}>
          A IA usa este texto como guia e adapta a resposta à mensagem do usuário. Desmarque Gemini para enviar texto fixo.
        </p>
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#3b82f6' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#3b82f6' }} />
    </div>
  );
});
MessageNode.displayName = 'MessageNode';
